# sing-box 服务器配置参考文档

## 1. 简介

sing-box 是一款跨平台的网络代理工具，支持服务器端和客户端部署，兼容多种代理协议。本文档基于 **1.11.15 稳定版**编写，涵盖配置文件结构、核心参数说明、示例配置及高级特性，帮助用户快速搭建安全高效的代理服务。

> **版本提示**：自 v1.8.0 起，传统 `geoip`/`geosite` 被 **rule-set** 取代，旧配置需按本文档迁移。

## 2. 配置文件结构

sing-box 配置文件采用 JSON 格式，顶层字段如下：

```json
{
  "log": {},           // 日志配置
  "dns": {},           // DNS 配置
  "ntp": {},           // 时间同步配置
  "certificate": {},   // TLS 证书配置
  "inbounds": [],      // 入站协议配置
  "outbounds": [],     // 出站协议配置
  "route": {},         // 路由规则配置
  "services": [],      // 服务配置（实验性功能）
  "experimental": {}   // 实验性功能配置
}
```

### 2.1 核心字段说明

| 字段         | 作用                                       | 版本要求       |
|--------------|--------------------------------------------|----------------|
| `log`        | 控制日志级别、输出路径                     | 所有版本       |
| `dns`        | 配置 DNS 服务器及分流规则                  | 所有版本       |
| `inbounds`   | 定义接收客户端连接的协议和端口             | 所有版本       |
| `outbounds`  | 定义转发流量的目标服务器和协议             | 所有版本       |
| `route`      | 通过规则分流流量至不同出站节点             | 所有版本       |
| `rule-set`   | 替代传统 GeoIP/GeoSite 的规则集（必选）    | v1.8.0+        |

## 3. 核心配置详解

### 3.1 日志配置 (`log`)

```json
{
  "log": {
    "level": "info",       // 日志级别：debug/info/warn/error
    "timestamp": true,     // 显示时间戳
    "output": "/var/log/sing-box.log"  // 日志输出路径
  }
}
```

### 3.2 DNS 配置 (`dns`)

防止 DNS 泄露并优化解析性能：

```json
{
  "dns": {
    "servers": [
      {
        "tag": "cloudflare",
        "address": "https://1.1.1.1/dns-query",  // DoH 服务器
        "detour": "proxy"  // 通过代理节点解析
      },
      {
        "tag": "local",
        "address": "223.5.5.5",  // 本地 DNS
        "detour": "direct"       // 直连解析
      }
    ],
    "rules": [
      {
        "geosite": "cn",         // 国内域名使用本地 DNS
        "server": "local"
      },
      {
        "geosite": "category-ads-all",  // 广告域名拦截
        "server": "block"
      }
    ],
    "strategy": "ipv4_only",  // 优先使用 IPv4
    "cache_capacity": 1024    // DNS 缓存大小（v1.11.0+）
  }
}
```

### 3.3 入站协议 (`inbounds`)

#### 3.3.1 Shadowsocks 示例

```json
{
  "type": "shadowsocks",
  "tag": "ss-in",
  "listen": "::",          // 监听所有 IP 地址（IPv4/IPv6）
  "listen_port": 8388,     // 监听端口
  "method": "2022-blake3-aes-128-gcm",  // 加密方式
  "password": "your-strong-password",    // 密码
  "tcp_fast_open": true,   // 启用 TCP 快速打开
  "sniff": true,           // 启用流量探测（用于路由分流）
  "multiplex": {           // 启用多路复用（v1.10.0+）
    "enabled": true,
    "brutal": {
      "enabled": true,
      "up_mbps": 100,      // 上行带宽限制
      "down_mbps": 1000    // 下行带宽限制
    }
  }
}
```

#### 3.3.2 Hysteria2 示例

```json
{
  "type": "hysteria2",
  "tag": "hy2-in",
  "listen": "0.0.0.0",
  "listen_port": 443,
  "auth": {
    "type": "password",
    "password": "your-password"
  },
  "tls": {
    "enabled": true,
    "certificate_path": "/etc/ssl/certs/fullchain.pem",  // 证书路径
    "key_path": "/etc/ssl/private/privkey.pem"            // 私钥路径
  },
  "masquerade": {
    "type": "proxy",
    "server": "https://www.bing.com"  // 伪装目标
  }
}
```

### 3.4 出站协议 (`outbounds`)

#### 3.4.1 VLESS-Reality 示例

```json
{
  "type": "vless",
  "tag": "vless-out",
  "server": "your-server.com",
  "server_port": 443,
  "uuid": "your-uuid",
  "flow": "xtls-rprx-vision",  // 流控模式
  "reality": {
    "enabled": true,
    "short_id": "abcdef",       // 短 ID
    "server_name": "www.microsoft.com",  // 目标服务器域名
    "private_key": "your-reality-private-key"  // Reality 私钥
  },
  "tls": {
    "enabled": true,
    "server_name": "www.microsoft.com",
    "insecure": false  // 禁用证书验证（测试用）
  }
}
```

#### 3.4.2 负载均衡出站 (`selector`)

```json
{
  "type": "selector",
  "tag": "auto-select",
  "outbounds": ["hy2-out", "ss-out", "vless-out"],  // 候选出站节点
  "default": "hy2-out",  // 默认节点
  "interval": "30s"      // 自动测速间隔
}
```

### 3.5 路由规则 (`route`)

基于 rule-set 实现智能分流：

```json
{
  "route": {
    "rules": [
      {
        "protocol": "dns",       // DNS 流量走专用出站
        "outbound": "dns-out"
      },
      {
        "rule_set": ["geosite-cn", "geoip-cn"],  // 国内流量直连
        "outbound": "direct"
      },
      {
        "rule_set": "geosite-category-ads-all",  // 拦截广告
        "outbound": "block"
      },
      {
        "network": "udp",        // UDP 流量走 Hysteria2
        "outbound": "hy2-out"
      }
    ],
    "rule_set": [
      {
        "tag": "geosite-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://github.com/SagerNet/sing-geosite/raw/rule-set/geosite-cn.srs",
        "update_interval": "1d"  // 每日更新规则
      },
      {
        "tag": "geoip-cn",
        "type": "remote",
        "url": "https://github.com/SagerNet/sing-geoip/raw/rule-set/geoip-cn.srs"
      }
    ],
    "final": "auto-select",  // 默认出站（未匹配规则流量）
    "auto_detect_interface": true  // 自动检测出口网卡
  }
}
```

## 4. 完整配置示例

### 4.1 单节点服务器配置

```json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "dns": {
    "servers": [
      {
        "tag": "cf",
        "address": "https://1.1.1.1/dns-query",
        "detour": "proxy"
      },
      {
        "tag": "local",
        "address": "223.5.5.5",
        "detour": "direct"
      }
    ],
    "rules": [
      { "geosite": "cn", "server": "local" },
      { "geosite": "category-ads-all", "server": "block" }
    ],
    "strategy": "ipv4_only"
  },
  "inbounds": [
    {
      "type": "hysteria2",
      "tag": "hy2-in",
      "listen": "0.0.0.0",
      "listen_port": 443,
      "auth": { "type": "password", "password": "your-password" },
      "tls": {
        "enabled": true,
        "certificate_path": "/etc/letsencrypt/live/your-domain/fullchain.pem",
        "key_path": "/etc/letsencrypt/live/your-domain/privkey.pem"
      }
    }
  ],
  "outbounds": [
    { "type": "direct", "tag": "direct" },
    { "type": "block", "tag": "block" },
    { "type": "dns", "tag": "dns-out" }
  ],
  "route": {
    "rules": [
      { "protocol": "dns", "outbound": "dns-out" },
      { "rule_set": "geosite-cn", "outbound": "direct" },
      { "rule_set": "geoip-cn", "outbound": "direct" },
      { "rule_set": "geosite-category-ads-all", "outbound": "block" }
    ],
    "rule_set": [
      {
        "tag": "geosite-cn",
        "type": "remote",
        "url": "https://github.com/SagerNet/sing-geosite/raw/rule-set/geosite-cn.srs"
      },
      {
        "tag": "geoip-cn",
        "type": "remote",
        "url": "https://github.com/SagerNet/sing-geoip/raw/rule-set/geoip-cn.srs"
      },
      {
        "tag": "geosite-category-ads-all",
        "type": "remote",
        "url": "https://github.com/SagerNet/sing-geosite/raw/rule-set/geosite-category-ads-all.srs"
      }
    ],
    "final": "direct",
    "auto_detect_interface": true
  }
}
```

### 4.2 ACME 自动证书配置

```json
{
  "certificate": {
    "acme": {
      "domain": "your-domain.com",
      "email": "your-email@example.com",
      "provider": "letsencrypt",  // 证书提供商
      "renewal_window": "72h",    // 提前 72 小时续期
      "dns_challenge": {
        "provider": "cloudflare",  // DNS 验证提供商
        "api_token": "your-cloudflare-api-token"
      }
    }
  }
}
```

## 5. 版本迁移指南

### 5.1 从 v1.7.x 迁移至 v1.11.x

1. **替换 GeoIP/GeoSite 为 rule-set**：
   ```json
   // 旧配置
   "route": {
     "rules": [{"geoip": "cn", "outbound": "direct"}]
   }

   // 新配置
   "route": {
     "rules": [{"rule_set": "geoip-cn", "outbound": "direct"}],
     "rule_set": [{"tag": "geoip-cn", "type": "remote", "url": "..."}]
   }
   ```

2. **移除废弃字段**：
   - `domain_strategy` → 使用 `sniff` + 路由规则替代
   - `fake_ip` → 移至 `dns.fake_ip`
   - `inbound.domain_strategy` → 移除，由路由规则控制

3. **启用实验性功能**：
   ```json
   "experimental": {
     "clash_api": {  // 启用 Clash API 兼容
       "external_controller": "127.0.0.1:9090",
       "secret": "your-api-secret"
     }
   }
   ```

## 6. 调试与验证

### 6.1 配置验证

```bash
sing-box check -c /etc/sing-box/config.json  # 检查配置格式
```

### 6.2 常见错误排查

| 错误类型          | 原因分析                          | 解决方案                          |
|-------------------|-----------------------------------|-----------------------------------|
| JSON 格式错误     | 多余逗号、引号不匹配              | 使用 [JSONLint](https://jsonlint.com/) 验证 |
| 端口占用          | 其他服务占用配置端口              | 更换 `listen_port` 或停止冲突服务 |
| TLS 握手失败      | 证书路径错误或域名不匹配          | 检查 `tls.certificate_path` 和 `server_name` |
| 规则集下载失败    | 网络问题或 URL 错误               | 使用 `download_detour: "direct"` 直连下载 |

## 7. 高级特性

### 7.1 端口跳跃（防封锁）

```json
{
  "inbounds": [
    {
      "type": "hysteria2",
      "listen_port": 443,
      "port_hopping": {
        "enabled": true,
        "range": "50000-51000",  // 端口范围
        "interval": "30s"        // 30秒切换一次端口
      }
    }
  ]
}
```

### 7.2 TUN 透明代理（仅 Linux）

```json
{
  "inbounds": [
    {
      "type": "tun",
      "inet4_address": "172.19.0.1/30",  // TUN 网卡 IP
      "auto_route": true,                // 自动配置路由
      "strict_route": true,              // 严格路由模式
      "stack": "gvisor"                  // 使用 gVisor 协议栈
    }
  ]
}
```

## 8. 服务管理

### 8.1 Systemd 服务配置

```ini
# /etc/systemd/system/sing-box.service
[Unit]
Description=sing-box service
After=network.target

[Service]
User=root
ExecStart=/usr/local/bin/sing-box run -c /etc/sing-box/config.json
Restart=on-failure
RestartSec=3s

[Install]
WantedBy=multi-user.target
```

启动命令：
```bash
sudo systemctl enable --now sing-box  # 开机自启并启动服务
sudo systemctl status sing-box        # 查看状态
sudo journalctl -u sing-box -f        # 实时日志
```

### 8.2 Docker 部署

```yaml
# docker-compose.yml
version: "3"
services:
  sing-box:
    image: ghcr.io/sagernet/sing-box
    restart: always
    network_mode: "host"
    volumes:
      - ./config.json:/etc/sing-box/config.json
    cap_add:
      - NET_ADMIN  # TUN 模式需要
    devices:
      - /dev/net/tun:/dev/net/tun
```

## 9. 参考链接

- [官方文档](https://sing-box.sagernet.org/configuration/)
- [Rule-set 规则库](https://github.com/SagerNet/sing-geosite)
- [Reality 协议指南](https://sing-box.sagernet.org/configuration/outbounds/vless/#reality)
- [ACME 证书配置](https://sing-box.sagernet.org/configuration/certificate/#acme)