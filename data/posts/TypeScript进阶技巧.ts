import { BlogPost } from '../博客文章类型定义';

export const post: BlogPost = {
  id: 'typescript-advanced-tips',
  title: "TypeScript进阶技巧",
  description: "掌握TypeScript的高级特性和实用技巧，提升代码质量和开发效率",
  keywords: ["TypeScript", "类型系统", "泛型", "工具类型", "进阶"],
  
  author: "Daifuku",
  publishDate: "2024-01-25",
  category: "frontend",
  tags: ["typescript", "javascript", "api"],
  
  content: `# TypeScript进阶技巧

## 前言

TypeScript作为JavaScript的超集，提供了强大的类型系统。本文将介绍一些进阶的TypeScript技巧，帮助你写出更加类型安全和优雅的代码。

## 高级类型

### 1. 联合类型和交叉类型

\`\`\`typescript
// 联合类型
type Status = 'loading' | 'success' | 'error';

// 交叉类型
type User = {
  name: string;
  age: number;
};

type Admin = {
  permissions: string[];
};

type AdminUser = User & Admin;
\`\`\`

### 2. 条件类型

\`\`\`typescript
// 基础条件类型
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// 结果: string[] | number[]
\`\`\`

### 3. 映射类型

\`\`\`typescript
// 基础映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 可选映射类型
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 自定义映射类型
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<{ name: string; age: number }>;
// 结果: { getName: () => string; getAge: () => number; }
\`\`\`

## 实用工具类型

### 1. 内置工具类型

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Pick - 选择特定属性
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit - 排除特定属性
type CreateUser = Omit<User, 'id'>;

// Record - 创建记录类型
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

// ReturnType - 获取函数返回类型
function getUser() {
  return { id: 1, name: 'John' };
}

type UserType = ReturnType<typeof getUser>;
\`\`\`

### 2. 自定义工具类型

\`\`\`typescript
// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 非空类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 函数参数类型
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

// 数组元素类型
type ArrayElement<T> = T extends (infer U)[] ? U : never;
\`\`\`

## 泛型进阶

### 1. 泛型约束

\`\`\`typescript
// 基础约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 键约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 条件约束
type ApiResponse<T> = T extends string
  ? { message: T }
  : T extends number
  ? { code: T }
  : { data: T };
\`\`\`

### 2. 泛型工厂函数

\`\`\`typescript
// 创建类型安全的状态管理
function createStore<T>(initialState: T) {
  let state = initialState;
  
  return {
    getState: (): T => state,
    setState: (newState: Partial<T>) => {
      state = { ...state, ...newState };
    },
    subscribe: (listener: (state: T) => void) => {
      // 订阅逻辑
    }
  };
}

// 使用
const userStore = createStore({
  name: '',
  age: 0,
  email: ''
});

userStore.setState({ name: 'John' }); // 类型安全
\`\`\`

## 装饰器和元数据

### 1. 类装饰器

\`\`\`typescript
function Entity(tableName: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      tableName = tableName;
    };
  };
}

@Entity('users')
class User {
  constructor(public name: string) {}
}
\`\`\`

### 2. 属性装饰器

\`\`\`typescript
function Column(options?: { type?: string; nullable?: boolean }) {
  return function (target: any, propertyKey: string) {
    // 存储元数据
    Reflect.defineMetadata('column', options, target, propertyKey);
  };
}

class User {
  @Column({ type: 'varchar', nullable: false })
  name: string;
  
  @Column({ type: 'int' })
  age: number;
}
\`\`\`

## 模块和命名空间

### 1. 模块声明

\`\`\`typescript
// 声明第三方库类型
declare module 'my-library' {
  export function doSomething(value: string): number;
  export interface Config {
    apiKey: string;
    timeout: number;
  }
}

// 扩展现有模块
declare module 'express' {
  interface Request {
    user?: User;
  }
}
\`\`\`

### 2. 全局类型声明

\`\`\`typescript
// global.d.ts
declare global {
  interface Window {
    myGlobalFunction: (data: any) => void;
  }
  
  var ENV: 'development' | 'production' | 'test';
}

export {}; // 确保这是一个模块
\`\`\`

## 性能优化技巧

### 1. 类型缓存

\`\`\`typescript
// 使用类型别名缓存复杂类型
type ComplexType<T> = {
  [K in keyof T]: T[K] extends object ? ComplexType<T[K]> : T[K];
};

// 缓存常用类型
type StringRecord = Record<string, string>;
type NumberRecord = Record<string, number>;
\`\`\`

### 2. 避免过度嵌套

\`\`\`typescript
// ❌ 避免过深的类型嵌套
type DeepNested = {
  level1: {
    level2: {
      level3: {
        level4: string;
      };
    };
  };
};

// ✅ 使用类型别名分解
type Level4 = { level4: string };
type Level3 = { level3: Level4 };
type Level2 = { level2: Level3 };
type Level1 = { level1: Level2 };
\`\`\`

## 实战案例

### 1. 类型安全的API客户端

\`\`\`typescript
interface ApiEndpoints {
  '/users': {
    GET: { response: User[] };
    POST: { body: CreateUser; response: User };
  };
  '/users/:id': {
    GET: { params: { id: string }; response: User };
    PUT: { params: { id: string }; body: Partial<User>; response: User };
  };
}

class ApiClient {
  async request<
    Path extends keyof ApiEndpoints,
    Method extends keyof ApiEndpoints[Path]
  >(
    path: Path,
    method: Method,
    options?: ApiEndpoints[Path][Method] extends { body: infer B }
      ? { body: B }
      : ApiEndpoints[Path][Method] extends { params: infer P }
      ? { params: P }
      : {}
  ): Promise<ApiEndpoints[Path][Method] extends { response: infer R } ? R : never> {
    // 实现请求逻辑
    throw new Error('Not implemented');
  }
}

// 使用
const client = new ApiClient();
const users = await client.request('/users', 'GET'); // 类型: User[]
\`\`\`

### 2. 状态机类型

\`\`\`typescript
type LoadingState = {
  status: 'loading';
};

type SuccessState = {
  status: 'success';
  data: any;
};

type ErrorState = {
  status: 'error';
  error: string;
};

type AsyncState = LoadingState | SuccessState | ErrorState;

function handleState(state: AsyncState) {
  switch (state.status) {
    case 'loading':
      // TypeScript知道这里没有data或error属性
      return 'Loading...';
    case 'success':
      // TypeScript知道这里有data属性
      return state.data;
    case 'error':
      // TypeScript知道这里有error属性
      return state.error;
  }
}
\`\`\`

## 总结

TypeScript的类型系统非常强大，掌握这些进阶技巧可以帮助你：

1. **编写更加类型安全的代码**
2. **提升开发效率和代码质量**
3. **减少运行时错误**
4. **改善代码的可维护性**
5. **提供更好的IDE支持**

继续深入学习TypeScript，你会发现它不仅仅是JavaScript的类型注解，而是一个功能完整的类型系统，能够帮助你构建更加健壮的应用程序。`,
  
  coverImage: "/images/typescript-cover.jpg",
  excerpt: "掌握TypeScript的高级特性和实用技巧",
  readTime: 15,
  isPublished: true
};