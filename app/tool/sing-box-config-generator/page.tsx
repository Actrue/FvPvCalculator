'use client';

import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import Toast from '../../components/Toast';

// Zod schemas for sing-box configuration
const LogSchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']).optional(),
  timestamp: z.boolean().optional(),
  output: z.string().optional(),
});

const DNSServerSchema = z.object({
  tag: z.string(),
  address: z.string(),
  detour: z.string().optional(),
});

const DNSRuleSchema = z.object({
  geosite: z.string().optional(),
  server: z.string(),
});

const DNSSchema = z.object({
  servers: z.array(DNSServerSchema).optional(),
  rules: z.array(DNSRuleSchema).optional(),
  strategy: z.enum(['ipv4_only', 'ipv6_only', 'prefer_ipv4', 'prefer_ipv6']).optional(),
  cache_capacity: z.number().optional(),
});

const InboundSchema = z.object({
  type: z.string(),
  tag: z.string(),
  listen: z.string().optional(),
  listen_port: z.number().optional(),
  method: z.string().optional(),
  password: z.string().optional(),
  tcp_fast_open: z.boolean().optional(),
  sniff: z.boolean().optional(),
  multiplex: z.object({
    enabled: z.boolean().optional(),
    brutal: z.object({
      enabled: z.boolean().optional(),
      up_mbps: z.number().optional(),
      down_mbps: z.number().optional(),
    }).optional(),
  }).optional(),
  auth: z.object({
    type: z.string().optional(),
    password: z.string().optional(),
  }).optional(),
  tls: z.object({
    enabled: z.boolean().optional(),
    certificate_path: z.string().optional(),
    key_path: z.string().optional(),
    server_name: z.string().optional(),
  }).optional(),
  reality: z.object({
    enabled: z.boolean().optional(),
    short_id: z.string().optional(),
    server_name: z.string().optional(),
    private_key: z.string().optional(),
  }).optional(),
  flow: z.string().optional(),
  uuid: z.string().optional(),
}).optional();

const OutboundSchema = z.object({
  type: z.string(),
  tag: z.string(),
  server: z.string().optional(),
  server_port: z.number().optional(),
  method: z.string().optional(),
  password: z.string().optional(),
  uuid: z.string().optional(),
  flow: z.string().optional(),
  tls: z.object({
    enabled: z.boolean().optional(),
    server_name: z.string().optional(),
    insecure: z.boolean().optional(),
  }).optional(),
  reality: z.object({
    enabled: z.boolean().optional(),
    short_id: z.string().optional(),
    server_name: z.string().optional(),
    private_key: z.string().optional(),
  }).optional(),
}).optional();

const RouteRuleSchema = z.object({
  protocol: z.string().optional(),
  rule_set: z.union([z.string(), z.array(z.string())]).optional(),
  outbound: z.string().optional(),
  network: z.string().optional(),
});

const RouteSetSchema = z.object({
  tag: z.string(),
  type: z.string(),
  format: z.string().optional(),
  url: z.string().optional(),
  update_interval: z.string().optional(),
});

const RouteSchema = z.object({
  rules: z.array(RouteRuleSchema).optional(),
  rule_set: z.array(RouteSetSchema).optional(),
  final: z.string().optional(),
  auto_detect_interface: z.boolean().optional(),
});

const CertificateACMEDNSChallengeSchema = z.object({
  provider: z.string(),
  api_token: z.string(),
});

const CertificateACMESchema = z.object({
  domain: z.string(),
  email: z.string(),
  provider: z.string(),
  renewal_window: z.string().optional(),
  dns_challenge: CertificateACMEDNSChallengeSchema.optional(),
});

const CertificateSchema = z.object({
  acme: CertificateACMESchema.optional(),
});

const SingBoxConfigSchema = z.object({
  log: LogSchema.optional(),
  dns: DNSSchema.optional(),
  ntp: z.record(z.string(), z.any()).optional(),
  certificate: CertificateSchema.optional(),
  inbounds: z.array(InboundSchema).optional(),
  outbounds: z.array(OutboundSchema).optional(),
  route: RouteSchema.optional(),
  services: z.array(z.record(z.string(), z.any())).optional(),
  experimental: z.record(z.string(), z.any()).optional(),
});

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function SingBoxConfigGeneratorPage() {
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [jsonOutput, setJsonOutput] = useState<string>('');
  
  // Form state for different sections
  const [logConfig, setLogConfig] = useState({
    level: 'info',
    timestamp: true,
    output: ''
  });
  
  const [dnsServers, setDnsServers] = useState([
    { tag: 'cloudflare', address: 'https://1.1.1.1/dns-query', detour: 'proxy' }
  ]);
  
  const [dnsRules, setDnsRules] = useState([
    { geosite: 'cn', server: 'local' }
  ]);
  
  const [dnsStrategy, setDnsStrategy] = useState('ipv4_only');
  const [dnsCacheCapacity, setDnsCacheCapacity] = useState(1024);
  
  const [inbounds, setInbounds] = useState([
    {
      type: 'hysteria2',
      tag: 'hy2-in',
      listen: '0.0.0.0',
      listen_port: 443,
      method: '',
      password: '',
      tcp_fast_open: false,
      sniff: false,
      flow: '',
      uuid: '',
      auth: { type: 'password', password: '' },
      tls: { enabled: true, certificate_path: '', key_path: '', server_name: '' },
      reality: { enabled: false, short_id: '', server_name: '', private_key: '' }
    }
  ]);
  
  const [outbounds, setOutbounds] = useState([
    { type: 'direct', tag: 'direct', server: '', server_port: 0, method: '', password: '', uuid: '', flow: '', tls: { enabled: false, server_name: '', insecure: false }, reality: { enabled: false, short_id: '', server_name: '', private_key: '' } },
    { type: 'block', tag: 'block', server: '', server_port: 0, method: '', password: '', uuid: '', flow: '', tls: { enabled: false, server_name: '', insecure: false }, reality: { enabled: false, short_id: '', server_name: '', private_key: '' } }
  ]);
  
  const [routeRules, setRouteRules] = useState([
    { protocol: 'dns', outbound: 'dns-out', rule_set: '', network: '' }
  ]);
  
  const [routeSets, setRouteSets] = useState([
    { tag: 'geosite-cn', type: 'remote', url: 'https://github.com/SagerNet/sing-geosite/raw/rule-set/geosite-cn.srs', format: '', update_interval: '' }
  ]);
  
  const [routeFinal, setRouteFinal] = useState('direct');
  const [routeAutoDetect, setRouteAutoDetect] = useState(true);

  // Close toast
  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  // Add DNS server
  const addDnsServer = () => {
    setDnsServers([...dnsServers, { tag: '', address: '', detour: '' }]);
  };

  // Remove DNS server
  const removeDnsServer = (index: number) => {
    const newServers = [...dnsServers];
    newServers.splice(index, 1);
    setDnsServers(newServers);
  };

  // Update DNS server
  const updateDnsServer = (index: number, field: string, value: string) => {
    const newServers = [...dnsServers];
    (newServers[index] as any)[field] = value;
    setDnsServers(newServers);
  };

  // Add DNS rule
  const addDnsRule = () => {
    setDnsRules([...dnsRules, { geosite: '', server: '' }]);
  };

  // Remove DNS rule
  const removeDnsRule = (index: number) => {
    const newRules = [...dnsRules];
    newRules.splice(index, 1);
    setDnsRules(newRules);
  };

  // Update DNS rule
  const updateDnsRule = (index: number, field: string, value: string) => {
    const newRules = [...dnsRules];
    (newRules[index] as any)[field] = value;
    setDnsRules(newRules);
  };

  // Add inbound
  const addInbound = () => {
    setInbounds([...inbounds, {
      type: 'hysteria2',
      tag: '',
      listen: '0.0.0.0',
      listen_port: 0,
      method: '',
      password: '',
      tcp_fast_open: false,
      sniff: false,
      flow: '',
      uuid: '',
      auth: { type: 'password', password: '' },
      tls: { enabled: false, certificate_path: '', key_path: '', server_name: '' },
      reality: { enabled: false, short_id: '', server_name: '', private_key: '' }
    }]);
  };

  // Remove inbound
  const removeInbound = (index: number) => {
    const newInbounds = [...inbounds];
    newInbounds.splice(index, 1);
    setInbounds(newInbounds);
  };

  // Update inbound
  const updateInbound = (index: number, field: string, value: string | number | boolean) => {
    const newInbounds = [...inbounds];
    const inbound = { ...newInbounds[index] };
    
    if (field.startsWith('auth.')) {
      const authField = field.split('.')[1];
      // Initialize auth object if it doesn't exist
      if (!inbound.auth) {
        inbound.auth = { type: 'password', password: '' };
      }
      (inbound.auth as any)[authField] = value;
    } else if (field.startsWith('tls.')) {
      const tlsField = field.split('.')[1];
      // Initialize tls object if it doesn't exist
      if (!inbound.tls) {
        inbound.tls = { enabled: false, certificate_path: '', key_path: '', server_name: '' };
      }
      (inbound.tls as any)[tlsField] = value;
    } else if (field.startsWith('reality.')) {
      const realityField = field.split('.')[1];
      // Initialize reality object if it doesn't exist
      if (!inbound.reality) {
        inbound.reality = { enabled: false, short_id: '', server_name: '', private_key: '' };
      }
      (inbound.reality as any)[realityField] = value;
    } else {
      (inbound as any)[field] = value;
    }
    
    newInbounds[index] = inbound;
    setInbounds(newInbounds);
  };

  // Add outbound
  const addOutbound = () => {
    setOutbounds([...outbounds, {
      type: 'direct',
      tag: '',
      server: '',
      server_port: 0,
      method: '',
      password: '',
      uuid: '',
      flow: '',
      tls: { enabled: false, server_name: '', insecure: false },
      reality: { enabled: false, short_id: '', server_name: '', private_key: '' }
    }]);
  };

  // Remove outbound
  const removeOutbound = (index: number) => {
    const newOutbounds = [...outbounds];
    newOutbounds.splice(index, 1);
    setOutbounds(newOutbounds);
  };

  // Update outbound
  const updateOutbound = (index: number, field: string, value: string | number | boolean) => {
    const newOutbounds = [...outbounds];
    const outbound = { ...newOutbounds[index] };
    
    if (field.startsWith('tls.')) {
      const tlsField = field.split('.')[1];
      // Initialize tls object if it doesn't exist
      if (!outbound.tls) {
        outbound.tls = { enabled: false, server_name: '', insecure: false };
      }
      (outbound.tls as any)[tlsField] = value;
    } else if (field.startsWith('reality.')) {
      const realityField = field.split('.')[1];
      // Initialize reality object if it doesn't exist
      if (!outbound.reality) {
        outbound.reality = { enabled: false, short_id: '', server_name: '', private_key: '' };
      }
      (outbound.reality as any)[realityField] = value;
    } else {
      (outbound as any)[field] = value;
    }
    
    newOutbounds[index] = outbound;
    setOutbounds(newOutbounds);
  };

  // Add route rule
  const addRouteRule = () => {
    setRouteRules([...routeRules, { protocol: '', outbound: '', rule_set: '', network: '' }]);
  };

  // Remove route rule
  const removeRouteRule = (index: number) => {
    const newRules = [...routeRules];
    newRules.splice(index, 1);
    setRouteRules(newRules);
  };

  // Update route rule
  const updateRouteRule = (index: number, field: string, value: string) => {
    const newRules = [...routeRules];
    (newRules[index] as any)[field] = value;
    setRouteRules(newRules);
  };

  // Add route set
  const addRouteSet = () => {
    setRouteSets([...routeSets, { tag: '', type: 'remote', url: '', format: '', update_interval: '' }]);
  };

  // Remove route set
  const removeRouteSet = (index: number) => {
    const newSets = [...routeSets];
    newSets.splice(index, 1);
    setRouteSets(newSets);
  };

  // Update route set
  const updateRouteSet = (index: number, field: string, value: string) => {
    const newSets = [...routeSets];
    (newSets[index] as any)[field] = value;
    setRouteSets(newSets);
  };

  // Generate configuration
  const generateConfig = () => {
    try {
      // Prepare DNS servers
      const preparedDnsServers = dnsServers
        .filter(server => server.tag && server.address)
        .map(server => {
          const preparedServer: any = { tag: server.tag, address: server.address };
          if (server.detour) preparedServer.detour = server.detour;
          return preparedServer;
        });
      
      // Prepare DNS rules
      const preparedDnsRules = dnsRules
        .filter(rule => rule.server)
        .map(rule => {
          const preparedRule: any = { server: rule.server };
          if (rule.geosite) preparedRule.geosite = rule.geosite;
          return preparedRule;
        });
      
      // Prepare inbounds
      const preparedInbounds = inbounds
        .filter(inbound => inbound.tag)
        .map(inbound => {
          const preparedInbound: any = { type: inbound.type, tag: inbound.tag };
          
          // Add common fields if they exist
          if (inbound.listen) preparedInbound.listen = inbound.listen;
          if (inbound.listen_port) preparedInbound.listen_port = inbound.listen_port;
          if (inbound.method) preparedInbound.method = inbound.method;
          if (inbound.password) preparedInbound.password = inbound.password;
          if (inbound.tcp_fast_open !== undefined) preparedInbound.tcp_fast_open = inbound.tcp_fast_open;
          if (inbound.sniff !== undefined) preparedInbound.sniff = inbound.sniff;
          if (inbound.flow) preparedInbound.flow = inbound.flow;
          if (inbound.uuid) preparedInbound.uuid = inbound.uuid;
          
          // Add auth if it exists and has a password
          if (inbound.auth && (inbound.auth.type || inbound.auth.password)) {
            preparedInbound.auth = {};
            if (inbound.auth.type) preparedInbound.auth.type = inbound.auth.type;
            if (inbound.auth.password) preparedInbound.auth.password = inbound.auth.password;
          }
          
          // Add TLS if it exists and is enabled or has certificate paths
          if (inbound.tls && (inbound.tls.enabled || inbound.tls.certificate_path || inbound.tls.key_path || inbound.tls.server_name)) {
            preparedInbound.tls = {};
            if (inbound.tls.enabled !== undefined) preparedInbound.tls.enabled = inbound.tls.enabled;
            if (inbound.tls.certificate_path) preparedInbound.tls.certificate_path = inbound.tls.certificate_path;
            if (inbound.tls.key_path) preparedInbound.tls.key_path = inbound.tls.key_path;
            if (inbound.tls.server_name) preparedInbound.tls.server_name = inbound.tls.server_name;
          }
          
          // Add Reality if it exists and is enabled or has required fields
          if (inbound.reality && (inbound.reality.enabled || inbound.reality.short_id || inbound.reality.server_name || inbound.reality.private_key)) {
            preparedInbound.reality = {};
            if (inbound.reality.enabled !== undefined) preparedInbound.reality.enabled = inbound.reality.enabled;
            if (inbound.reality.short_id) preparedInbound.reality.short_id = inbound.reality.short_id;
            if (inbound.reality.server_name) preparedInbound.reality.server_name = inbound.reality.server_name;
            if (inbound.reality.private_key) preparedInbound.reality.private_key = inbound.reality.private_key;
          }
          
          return preparedInbound;
        });
      
      // Prepare outbounds
      const preparedOutbounds = outbounds
        .filter(outbound => outbound.tag)
        .map(outbound => {
          const preparedOutbound: any = { type: outbound.type, tag: outbound.tag };
          
          // Add common fields if they exist
          if (outbound.server) preparedOutbound.server = outbound.server;
          if (outbound.server_port) preparedOutbound.server_port = outbound.server_port;
          if (outbound.method) preparedOutbound.method = outbound.method;
          if (outbound.password) preparedOutbound.password = outbound.password;
          if (outbound.uuid) preparedOutbound.uuid = outbound.uuid;
          if (outbound.flow) preparedOutbound.flow = outbound.flow;
          
          // Add TLS if it exists and is enabled or has server name
          if (outbound.tls && (outbound.tls.enabled !== undefined || outbound.tls.server_name || outbound.tls.insecure !== undefined)) {
            preparedOutbound.tls = {};
            if (outbound.tls.enabled !== undefined) preparedOutbound.tls.enabled = outbound.tls.enabled;
            if (outbound.tls.server_name) preparedOutbound.tls.server_name = outbound.tls.server_name;
            if (outbound.tls.insecure !== undefined) preparedOutbound.tls.insecure = outbound.tls.insecure;
          }
          
          // Add Reality if it exists and is enabled or has required fields
          if (outbound.reality && (outbound.reality.enabled !== undefined || outbound.reality.short_id || outbound.reality.server_name || outbound.reality.private_key)) {
            preparedOutbound.reality = {};
            if (outbound.reality.enabled !== undefined) preparedOutbound.reality.enabled = outbound.reality.enabled;
            if (outbound.reality.short_id) preparedOutbound.reality.short_id = outbound.reality.short_id;
            if (outbound.reality.server_name) preparedOutbound.reality.server_name = outbound.reality.server_name;
            if (outbound.reality.private_key) preparedOutbound.reality.private_key = outbound.reality.private_key;
          }
          
          return preparedOutbound;
        });
      
      // Prepare route rules
      const preparedRouteRules = routeRules
        .filter(rule => rule.outbound)
        .map(rule => {
          const preparedRule: any = { outbound: rule.outbound };
          if (rule.protocol) preparedRule.protocol = rule.protocol;
          if (rule.rule_set) preparedRule.rule_set = rule.rule_set;
          if (rule.network) preparedRule.network = rule.network;
          return preparedRule;
        });
      
      // Prepare route sets
      const preparedRouteSets = routeSets
        .filter(set => set.tag && set.url)
        .map(set => {
          const preparedSet: any = { tag: set.tag, type: set.type };
          if (set.format) preparedSet.format = set.format;
          if (set.url) preparedSet.url = set.url;
          if (set.update_interval) preparedSet.update_interval = set.update_interval;
          return preparedSet;
        });
      
      const newConfig: any = {};
      
      // Add log config if any field is set
      if (logConfig.level || logConfig.timestamp !== undefined || logConfig.output) {
        newConfig.log = {};
        if (logConfig.level) newConfig.log.level = logConfig.level;
        if (logConfig.timestamp !== undefined) newConfig.log.timestamp = logConfig.timestamp;
        if (logConfig.output) newConfig.log.output = logConfig.output;
      }
      
      // Add DNS config if any field is set
      if (preparedDnsServers.length > 0 || preparedDnsRules.length > 0 || dnsStrategy || dnsCacheCapacity) {
        newConfig.dns = {};
        if (preparedDnsServers.length > 0) newConfig.dns.servers = preparedDnsServers;
        if (preparedDnsRules.length > 0) newConfig.dns.rules = preparedDnsRules;
        if (dnsStrategy) newConfig.dns.strategy = dnsStrategy;
        if (dnsCacheCapacity) newConfig.dns.cache_capacity = dnsCacheCapacity;
      }
      
      // Add inbounds
      if (preparedInbounds.length > 0) {
        newConfig.inbounds = preparedInbounds;
      }
      
      // Add outbounds
      if (preparedOutbounds.length > 0) {
        newConfig.outbounds = preparedOutbounds;
      }
      
      // Add route config if any field is set
      if (preparedRouteRules.length > 0 || preparedRouteSets.length > 0 || routeFinal || routeAutoDetect !== undefined) {
        newConfig.route = {};
        if (preparedRouteRules.length > 0) newConfig.route.rules = preparedRouteRules;
        if (preparedRouteSets.length > 0) newConfig.route.rule_set = preparedRouteSets;
        if (routeFinal) newConfig.route.final = routeFinal;
        if (routeAutoDetect !== undefined) newConfig.route.auto_detect_interface = routeAutoDetect;
      }

      // Validate with Zod
      const result = SingBoxConfigSchema.safeParse(newConfig);
      
      if (!result.success) {
        const errorMessage = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        setToast({ show: true, message: `配置验证失败: ${errorMessage}`, type: 'error' });
        return;
      }

      setJsonOutput(JSON.stringify(newConfig, null, 2));
      setToast({ show: true, message: '配置生成成功！', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: `生成配置时出错: ${error instanceof Error ? error.message : '未知错误'}`, type: 'error' });
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!jsonOutput) {
      setToast({ show: true, message: '没有可复制的配置', type: 'error' });
      return;
    }

    try {
      await navigator.clipboard.writeText(jsonOutput);
      setToast({ show: true, message: '配置已复制到剪贴板', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: '复制失败，请手动复制', type: 'error' });
    }
  };

  // Export as JSON file
  const exportAsJson = () => {
    if (!jsonOutput) {
      setToast({ show: true, message: '没有可导出的配置', type: 'error' });
      return;
    }

    try {
      const blob = new Blob([jsonOutput], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sing-box-config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToast({ show: true, message: '配置已导出为JSON文件', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: '导出失败', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back to home link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
        </div>

        {/* Page title */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Sing-Box 服务器配置生成器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            通过填写表单生成符合规范的 Sing-Box 服务器配置文件
          </p>
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration form */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">配置选项</h2>
              
              {/* Log configuration */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  日志配置
                  <span className="ml-2 text-sm text-gray-500" title="控制日志级别、输出路径等">ⓘ</span>
                </h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      日志级别
                      <span className="ml-1 text-gray-500" title="debug: 调试信息, info: 一般信息, warn: 警告信息, error: 错误信息">ⓘ</span>
                    </label>
                    <select
                      value={logConfig.level}
                      onChange={(e) => setLogConfig({...logConfig, level: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warn">Warn</option>
                      <option value="error">Error</option>
                      <option value="">不设置</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="timestamp"
                      checked={logConfig.timestamp}
                      onChange={(e) => setLogConfig({...logConfig, timestamp: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="timestamp" className="ml-2 block text-sm text-gray-900">
                      显示时间戳
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      日志输出路径
                      <span className="ml-1 text-gray-500" title="日志文件的保存路径，留空则输出到标准输出">ⓘ</span>
                    </label>
                    <input
                      type="text"
                      value={logConfig.output}
                      onChange={(e) => setLogConfig({...logConfig, output: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/var/log/sing-box.log (可选)"
                    />
                  </div>
                </div>
              </div>

              {/* DNS configuration */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  DNS 配置
                  <span className="ml-2 text-sm text-gray-500" title="配置 DNS 服务器及分流规则，防止 DNS 泄露">ⓘ</span>
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  {/* DNS Servers */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        DNS 服务器
                        <span className="ml-1 text-gray-500" title="定义 DNS 服务器地址和标签">ⓘ</span>
                      </label>
                      <button
                        onClick={addDnsServer}
                        className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        添加
                      </button>
                    </div>
                    {dnsServers.map((server, index) => (
                      <div key={index} className="mb-3 p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">服务器 {index + 1}</span>
                          {dnsServers.length > 1 && (
                            <button
                              onClick={() => removeDnsServer(index)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              删除
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">标签</label>
                            <input
                              type="text"
                              value={server.tag}
                              onChange={(e) => updateDnsServer(index, 'tag', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="server-tag"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">地址</label>
                            <input
                              type="text"
                              value={server.address}
                              onChange={(e) => updateDnsServer(index, 'address', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://1.1.1.1/dns-query"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">出站</label>
                            <input
                              type="text"
                              value={server.detour}
                              onChange={(e) => updateDnsServer(index, 'detour', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="proxy (可选)"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DNS Rules */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        DNS 规则
                        <span className="ml-1 text-gray-500" title="根据域名类型指定使用的 DNS 服务器">ⓘ</span>
                      </label>
                      <button
                        onClick={addDnsRule}
                        className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        添加
                      </button>
                    </div>
                    {dnsRules.map((rule, index) => (
                      <div key={index} className="mb-3 p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">规则 {index + 1}</span>
                          {dnsRules.length > 1 && (
                            <button
                              onClick={() => removeDnsRule(index)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              删除
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">域名类型</label>
                            <input
                              type="text"
                              value={rule.geosite}
                              onChange={(e) => updateDnsRule(index, 'geosite', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="cn (可选)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">DNS 服务器标签</label>
                            <input
                              type="text"
                              value={rule.server}
                              onChange={(e) => updateDnsRule(index, 'server', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="local"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DNS Strategy */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      解析策略
                      <span className="ml-1 text-gray-500" title="DNS 解析时优先使用的 IP 版本">ⓘ</span>
                    </label>
                    <select
                      value={dnsStrategy}
                      onChange={(e) => setDnsStrategy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ipv4_only">仅 IPv4</option>
                      <option value="ipv6_only">仅 IPv6</option>
                      <option value="prefer_ipv4">优先 IPv4</option>
                      <option value="prefer_ipv6">优先 IPv6</option>
                      <option value="">不设置</option>
                    </select>
                  </div>

                  {/* DNS Cache Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      缓存容量
                      <span className="ml-1 text-gray-500" title="DNS 缓存条目数量限制">ⓘ</span>
                    </label>
                    <input
                      type="number"
                      value={dnsCacheCapacity || ''}
                      onChange={(e) => setDnsCacheCapacity(e.target.value ? Number(e.target.value) : 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1024 (可选)"
                    />
                  </div>
                </div>
              </div>

              {/* Inbounds configuration */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  入站协议配置
                  <span className="ml-2 text-sm text-gray-500" title="定义接收客户端连接的协议和端口">ⓘ</span>
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      入站协议
                      <span className="ml-1 text-gray-500" title="接收客户端连接的协议配置">ⓘ</span>
                    </label>
                    <button
                      onClick={addInbound}
                      className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      添加
                    </button>
                  </div>
                  {inbounds.map((inbound, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">入站协议 {index + 1}</span>
                        {inbounds.length > 1 && (
                          <button
                            onClick={() => removeInbound(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            删除
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">协议类型</label>
                          <select
                            value={inbound.type}
                            onChange={(e) => updateInbound(index, 'type', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="hysteria2">Hysteria2</option>
                            <option value="shadowsocks">Shadowsocks</option>
                            <option value="vless">VLESS</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">标签</label>
                          <input
                            type="text"
                            value={inbound.tag}
                            onChange={(e) => updateInbound(index, 'tag', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="hy2-in"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">监听地址</label>
                          <input
                            type="text"
                            value={inbound.listen || ''}
                            onChange={(e) => updateInbound(index, 'listen', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.0.0.0 (可选)"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">监听端口</label>
                          <input
                            type="number"
                            value={inbound.listen_port || ''}
                            onChange={(e) => updateInbound(index, 'listen_port', e.target.value ? Number(e.target.value) : 0)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="443 (可选)"
                          />
                        </div>
                      </div>

                      {/* Common fields for all protocols */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">通用配置</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {/* Password field for Shadowsocks and others */}
                          {(inbound.type === 'shadowsocks' || inbound.type === 'hysteria2') && (
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">密码</label>
                              <input
                                type="text"
                                value={inbound.password || (inbound.auth?.password) || ''}
                                onChange={(e) => {
                                  if (inbound.type === 'shadowsocks') {
                                    updateInbound(index, 'password', e.target.value);
                                  } else {
                                    updateInbound(index, 'auth.password', e.target.value);
                                  }
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your-password"
                              />
                            </div>
                          )}
                          
                          {/* Method field for Shadowsocks */}
                          {inbound.type === 'shadowsocks' && (
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">加密方式</label>
                              <input
                                type="text"
                                value={inbound.method || ''}
                                onChange={(e) => updateInbound(index, 'method', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="2022-blake3-aes-128-gcm"
                              />
                            </div>
                          )}
                          
                          {/* UUID field for VLESS */}
                          {inbound.type === 'vless' && (
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">UUID</label>
                              <input
                                type="text"
                                value={inbound.uuid || ''}
                                onChange={(e) => updateInbound(index, 'uuid', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your-uuid"
                              />
                            </div>
                          )}
                          
                          {/* Flow field for VLESS */}
                          {inbound.type === 'vless' && (
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">流控模式</label>
                              <input
                                type="text"
                                value={inbound.flow || ''}
                                onChange={(e) => updateInbound(index, 'flow', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="xtls-rprx-vision (可选)"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* TLS configuration */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">TLS 配置</h4>
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`tls-enabled-${index}`}
                            checked={inbound.tls?.enabled || false}
                            onChange={(e) => updateInbound(index, 'tls.enabled', e.target.checked)}
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`tls-enabled-${index}`} className="ml-2 block text-xs text-gray-900">
                            启用 TLS
                          </label>
                        </div>
                        {inbound.tls?.enabled && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">证书路径</label>
                              <input
                                type="text"
                                value={inbound.tls?.certificate_path || ''}
                                onChange={(e) => updateInbound(index, 'tls.certificate_path', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="/etc/ssl/certs/fullchain.pem"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">私钥路径</label>
                              <input
                                type="text"
                                value={inbound.tls?.key_path || ''}
                                onChange={(e) => updateInbound(index, 'tls.key_path', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="/etc/ssl/private/privkey.pem"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">服务器名称</label>
                              <input
                                type="text"
                                value={inbound.tls?.server_name || ''}
                                onChange={(e) => updateInbound(index, 'tls.server_name', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your-domain.com (可选)"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reality configuration for VLESS */}
                      {inbound.type === 'vless' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">Reality 配置</h4>
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`reality-enabled-${index}`}
                              checked={inbound.reality?.enabled || false}
                              onChange={(e) => updateInbound(index, 'reality.enabled', e.target.checked)}
                              className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`reality-enabled-${index}`} className="ml-2 block text-xs text-gray-900">
                              启用 Reality
                            </label>
                          </div>
                          {inbound.reality?.enabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">短 ID</label>
                                <input
                                  type="text"
                                  value={inbound.reality?.short_id || ''}
                                  onChange={(e) => updateInbound(index, 'reality.short_id', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="abcdef"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">服务器名称</label>
                                <input
                                  type="text"
                                  value={inbound.reality?.server_name || ''}
                                  onChange={(e) => updateInbound(index, 'reality.server_name', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="www.microsoft.com"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">私钥</label>
                                <input
                                  type="text"
                                  value={inbound.reality?.private_key || ''}
                                  onChange={(e) => updateInbound(index, 'reality.private_key', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="your-reality-private-key"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Outbounds configuration */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  出站协议配置
                  <span className="ml-2 text-sm text-gray-500" title="定义转发流量的目标服务器和协议">ⓘ</span>
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      出站协议
                      <span className="ml-1 text-gray-500" title="转发流量的目标服务器配置">ⓘ</span>
                    </label>
                    <button
                      onClick={addOutbound}
                      className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      添加
                    </button>
                  </div>
                  {outbounds.map((outbound, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">出站协议 {index + 1}</span>
                        {outbounds.length > 1 && (
                          <button
                            onClick={() => removeOutbound(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            删除
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">协议类型</label>
                          <select
                            value={outbound.type}
                            onChange={(e) => updateOutbound(index, 'type', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="direct">Direct</option>
                            <option value="block">Block</option>
                            <option value="dns">DNS</option>
                            <option value="vless">VLESS</option>
                            <option value="shadowsocks">Shadowsocks</option>
                            <option value="hysteria2">Hysteria2</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">标签</label>
                          <input
                            type="text"
                            value={outbound.tag}
                            onChange={(e) => updateOutbound(index, 'tag', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="direct"
                          />
                        </div>
                        {(outbound.type === 'vless' || outbound.type === 'shadowsocks' || outbound.type === 'hysteria2') && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">服务器地址</label>
                              <input
                                type="text"
                                value={outbound.server || ''}
                                onChange={(e) => updateOutbound(index, 'server', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your-server.com"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">服务器端口</label>
                              <input
                                type="number"
                                value={outbound.server_port || ''}
                                onChange={(e) => updateOutbound(index, 'server_port', e.target.value ? Number(e.target.value) : 0)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="443"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Password and method for Shadowsocks */}
                      {outbound.type === 'shadowsocks' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">Shadowsocks 配置</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">密码</label>
                              <input
                                type="text"
                                value={outbound.password || ''}
                                onChange={(e) => updateOutbound(index, 'password', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your-password"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">加密方式</label>
                              <input
                                type="text"
                                value={outbound.method || ''}
                                onChange={(e) => updateOutbound(index, 'method', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="2022-blake3-aes-128-gcm"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* UUID and flow for VLESS */}
                      {outbound.type === 'vless' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">VLESS 配置</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">UUID</label>
                              <input
                                type="text"
                                value={outbound.uuid || ''}
                                onChange={(e) => updateOutbound(index, 'uuid', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your-uuid"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">流控模式</label>
                              <input
                                type="text"
                                value={outbound.flow || ''}
                                onChange={(e) => updateOutbound(index, 'flow', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="xtls-rprx-vision (可选)"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TLS configuration */}
                      {(outbound.type === 'vless' || outbound.type === 'shadowsocks' || outbound.type === 'hysteria2') && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">TLS 配置</h4>
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`outbound-tls-enabled-${index}`}
                              checked={outbound.tls?.enabled || false}
                              onChange={(e) => updateOutbound(index, 'tls.enabled', e.target.checked)}
                              className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`outbound-tls-enabled-${index}`} className="ml-2 block text-xs text-gray-900">
                              启用 TLS
                            </label>
                          </div>
                          {outbound.tls?.enabled !== undefined && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">服务器名称</label>
                                <input
                                  type="text"
                                  value={outbound.tls?.server_name || ''}
                                  onChange={(e) => updateOutbound(index, 'tls.server_name', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="your-domain.com"
                                />
                              </div>
                              <div className="flex items-center mt-4">
                                <input
                                  type="checkbox"
                                  id={`outbound-tls-insecure-${index}`}
                                  checked={outbound.tls?.insecure || false}
                                  onChange={(e) => updateOutbound(index, 'tls.insecure', e.target.checked)}
                                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`outbound-tls-insecure-${index}`} className="ml-2 block text-xs text-gray-900">
                                  禁用证书验证 (测试用)
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reality configuration for VLESS */}
                      {outbound.type === 'vless' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">Reality 配置</h4>
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`outbound-reality-enabled-${index}`}
                              checked={outbound.reality?.enabled || false}
                              onChange={(e) => updateOutbound(index, 'reality.enabled', e.target.checked)}
                              className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`outbound-reality-enabled-${index}`} className="ml-2 block text-xs text-gray-900">
                              启用 Reality
                            </label>
                          </div>
                          {outbound.reality?.enabled !== undefined && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">短 ID</label>
                                <input
                                  type="text"
                                  value={outbound.reality?.short_id || ''}
                                  onChange={(e) => updateOutbound(index, 'reality.short_id', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="abcdef"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">服务器名称</label>
                                <input
                                  type="text"
                                  value={outbound.reality?.server_name || ''}
                                  onChange={(e) => updateOutbound(index, 'reality.server_name', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="www.microsoft.com"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">私钥</label>
                                <input
                                  type="text"
                                  value={outbound.reality?.private_key || ''}
                                  onChange={(e) => updateOutbound(index, 'reality.private_key', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="your-reality-private-key"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Route configuration */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  路由配置
                  <span className="ml-2 text-sm text-gray-500" title="通过规则分流流量至不同出站节点">ⓘ</span>
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  {/* Route Rules */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        路由规则
                        <span className="ml-1 text-gray-500" title="根据协议、域名等条件指定流量使用的出站节点">ⓘ</span>
                      </label>
                      <button
                        onClick={addRouteRule}
                        className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        添加
                      </button>
                    </div>
                    {routeRules.map((rule, index) => (
                      <div key={index} className="mb-3 p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">规则 {index + 1}</span>
                          {routeRules.length > 1 && (
                            <button
                              onClick={() => removeRouteRule(index)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              删除
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">协议类型</label>
                            <input
                              type="text"
                              value={rule.protocol || ''}
                              onChange={(e) => updateRouteRule(index, 'protocol', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="dns (可选)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">出站标签</label>
                            <input
                              type="text"
                              value={rule.outbound}
                              onChange={(e) => updateRouteRule(index, 'outbound', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="dns-out"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">规则集</label>
                            <input
                              type="text"
                              value={rule.rule_set || ''}
                              onChange={(e) => updateRouteRule(index, 'rule_set', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="geosite-cn (可选)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">网络类型</label>
                            <input
                              type="text"
                              value={rule.network || ''}
                              onChange={(e) => updateRouteRule(index, 'network', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="udp (可选)"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Route Sets */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        规则集
                        <span className="ml-1 text-gray-500" title="定义规则集的来源和更新方式">ⓘ</span>
                      </label>
                      <button
                        onClick={addRouteSet}
                        className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        添加
                      </button>
                    </div>
                    {routeSets.map((set, index) => (
                      <div key={index} className="mb-3 p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">规则集 {index + 1}</span>
                          {routeSets.length > 1 && (
                            <button
                              onClick={() => removeRouteSet(index)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              删除
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">标签</label>
                            <input
                              type="text"
                              value={set.tag}
                              onChange={(e) => updateRouteSet(index, 'tag', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="geosite-cn"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">类型</label>
                            <select
                              value={set.type}
                              onChange={(e) => updateRouteSet(index, 'type', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="remote">远程</option>
                              <option value="local">本地</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">URL</label>
                            <input
                              type="text"
                              value={set.url}
                              onChange={(e) => updateRouteSet(index, 'url', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://github.com/SagerNet/sing-geosite/raw/rule-set/geosite-cn.srs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">更新间隔</label>
                            <input
                              type="text"
                              value={set.update_interval || ''}
                              onChange={(e) => updateRouteSet(index, 'update_interval', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="1d (可选)"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Route Final */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      默认出站
                      <span className="ml-1 text-gray-500" title="未匹配任何规则的流量使用的默认出站节点">ⓘ</span>
                    </label>
                    <input
                      type="text"
                      value={routeFinal}
                      onChange={(e) => setRouteFinal(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="direct"
                    />
                  </div>

                  {/* Route Auto Detect */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto-detect"
                      checked={routeAutoDetect}
                      onChange={(e) => setRouteAutoDetect(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="auto-detect" className="ml-2 block text-sm text-gray-900">
                      自动检测出口网卡
                      <span className="ml-1 text-gray-500" title="自动检测并使用正确的网络接口">ⓘ</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={generateConfig}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                生成配置
              </button>
            </div>

            {/* Configuration output */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">配置输出</h2>
              
              {jsonOutput ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      复制到剪贴板
                    </button>
                    <button
                      onClick={exportAsJson}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      导出为JSON文件
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <pre className="text-sm overflow-auto max-h-96 font-mono">
                      {jsonOutput}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">暂无配置</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    填写配置选项并点击"生成配置"按钮创建您的 Sing-Box 配置
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-6">使用说明</h2>
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900">功能特点</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>采用表格填写方式，直观易用</li>
              <li>支持 VLESS、Shadowsocks、Hysteria2 等多种协议</li>
              <li>提供详细的参数说明和选项解释</li>
              <li>基于 Zod 严格验证配置文件格式</li>
              <li>支持生成完整的 Sing-Box 服务器配置</li>
              <li>可将配置复制到剪贴板或导出为 JSON 文件</li>
              <li>允许留空可选配置项</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-4">使用步骤</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>在左侧配置选项中填写您的服务器配置信息</li>
              <li>点击"生成配置"按钮创建配置文件</li>
              <li>在右侧查看生成的 JSON 配置</li>
              <li>使用"复制到剪贴板"或"导出为JSON文件"保存配置</li>
            </ol>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-4">配置验证</h3>
            <p className="text-gray-600">
              本工具使用 Zod 库对生成的配置进行严格验证，确保符合 Sing-Box 的配置规范。
              如果配置不符合要求，将显示具体的错误信息。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}