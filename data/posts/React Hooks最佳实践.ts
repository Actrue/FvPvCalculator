import { BlogPost } from '../博客文章类型定义';

export const post: BlogPost = {
  id: 'react-hooks-best-practices',
  title: "React Hooks最佳实践",
  description: "深入探讨React Hooks的使用技巧、常见陷阱和最佳实践，提升React开发效率",
  keywords: ["React", "Hooks", "useState", "useEffect", "最佳实践"],
  
  author: "Daifuku",
  publishDate: "2024-01-20",
  category: "frontend",
  tags: ["react", "javascript", "performance"],
  
  content: `# React Hooks最佳实践

## 引言

React Hooks自16.8版本引入以来，彻底改变了我们编写React组件的方式。本文将分享一些实用的Hooks使用技巧和最佳实践。

## 基础Hooks回顾

### useState

\`\`\`typescript
const [count, setCount] = useState(0);

// 函数式更新
setCount(prevCount => prevCount + 1);

// 惰性初始化
const [state, setState] = useState(() => {
  return computeExpensiveValue();
});
\`\`\`

### useEffect

\`\`\`typescript
// 基本用法
useEffect(() => {
  document.title = \`点击了 \${count} 次\`;
}, [count]);

// 清理副作用
useEffect(() => {
  const timer = setInterval(() => {
    console.log('定时器执行');
  }, 1000);
  
  return () => clearInterval(timer);
}, []);
\`\`\`

## 自定义Hooks

### 1. useLocalStorage

\`\`\`typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
\`\`\`

### 2. useDebounce

\`\`\`typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

### 3. useFetch

\`\`\`typescript
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : '未知错误'
        });
      }
    };

    fetchData();
  }, [url]);

  return state;
}
\`\`\`

## 性能优化技巧

### 1. 使用useMemo和useCallback

\`\`\`typescript
function ExpensiveComponent({ items, filter }) {
  // 缓存计算结果
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]);

  // 缓存回调函数
  const handleClick = useCallback((id: string) => {
    console.log('点击了项目:', id);
  }, []);

  return (
    <div>
      {filteredItems.map(item => (
        <Item 
          key={item.id} 
          item={item} 
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
\`\`\`

### 2. 避免不必要的重渲染

\`\`\`typescript
// 使用React.memo包装组件
const MemoizedComponent = React.memo(function Component({ name, age }) {
  return <div>{name} - {age}</div>;
});

// 自定义比较函数
const MemoizedComponentWithCustomCompare = React.memo(
  function Component({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);
\`\`\`

## 常见陷阱和解决方案

### 1. useEffect依赖数组

\`\`\`typescript
// ❌ 错误：缺少依赖
useEffect(() => {
  fetchUserData(userId);
}, []); // 缺少userId依赖

// ✅ 正确：包含所有依赖
useEffect(() => {
  fetchUserData(userId);
}, [userId]);
\`\`\`

### 2. 状态更新的异步性

\`\`\`typescript
// ❌ 错误：直接使用状态值
const handleIncrement = () => {
  setCount(count + 1);
  setCount(count + 1); // 这里count还是旧值
};

// ✅ 正确：使用函数式更新
const handleIncrement = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
};
\`\`\`

### 3. 闭包陷阱

\`\`\`typescript
// ❌ 问题：闭包捕获了旧的count值
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1); // count永远是初始值
  }, 1000);
  return () => clearInterval(timer);
}, []);

// ✅ 解决方案1：使用函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);

// ✅ 解决方案2：使用useRef
const countRef = useRef(count);
countRef.current = count;

useEffect(() => {
  const timer = setInterval(() => {
    setCount(countRef.current + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);
\`\`\`

## 测试Hooks

\`\`\`typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('useCounter应该正确递增', () => {
  const { result } = renderHook(() => useCounter(0));
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
\`\`\`

## 总结

React Hooks提供了强大而灵活的状态管理和副作用处理能力。遵循以下原则可以帮你写出更好的Hooks代码：

1. **正确设置依赖数组**
2. **合理使用useMemo和useCallback**
3. **避免过度优化**
4. **编写可测试的自定义Hooks**
5. **理解闭包和异步更新的影响**

掌握这些最佳实践，你就能充分发挥React Hooks的威力，编写出更加优雅和高效的React应用。`,
  
  coverImage: "/images/react-hooks-cover.jpg",
  excerpt: "深入探讨React Hooks的使用技巧和最佳实践",
  readTime: 12,
  isPublished: true
};