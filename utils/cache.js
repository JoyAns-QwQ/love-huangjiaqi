// 本地缓存策略
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxAge = 30 * 60 * 1000; // 30分钟缓存过期时间
  }

  // 获取缓存
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  // 设置缓存
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // 删除缓存
  delete(key) {
    this.cache.delete(key);
  }

  // 清空所有缓存
  clear() {
    this.cache.clear();
  }
}

// 创建全局缓存实例
const cacheManager = new CacheManager();

// 导出缓存方法
export function getCache(key) {
  return cacheManager.get(key);
}

export function setCache(key, data) {
  cacheManager.set(key, data);
}

export function deleteCache(key) {
  cacheManager.delete(key);
}

export function clearCache() {
  cacheManager.clear();
}
