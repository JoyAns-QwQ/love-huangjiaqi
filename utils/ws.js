const app = getApp()

class WSClient {
  constructor() {
    this.socket = null
    this.reconnectTimer = null
    this.heartbeatTimer = null
    this.listeners = {} // type -> [callback]
    this.messageQueue = [] // 断线期间缓存的消息
  }

  // 连接WebSocket
  connect() {
    const token = wx.getStorageSync('token')
    if (!token) {
      console.error('No token found, cannot connect to WebSocket')
      return
    }

    this.socket = wx.connectSocket({
      url: 'ws://localhost:3000/ws?token=' + token,
      success: () => {
        console.log('WebSocket connected')
        this.startHeartbeat()
        this.processMessageQueue()
      },
      fail: (err) => {
        console.error('WebSocket connection failed:', err)
        this.scheduleReconnect()
      }
    })

    this.socket.onMessage((res) => {
      const data = JSON.parse(res.data)
      this.handleMessage(data)
    })

    this.socket.onClose(() => {
      console.log('WebSocket closed')
      this.scheduleReconnect()
    })

    this.socket.onError((err) => {
      console.error('WebSocket error:', err)
      this.scheduleReconnect()
    })
  }

  // 发送消息
  send(type, data) {
    if (!this.socket || this.socket.readyState !== 1) {
      this.messageQueue.push({ type, data })
      return false
    }

    this.socket.send({
      data: JSON.stringify({ type, data }),
      success: () => {
        console.log('Message sent:', type)
      },
      fail: (err) => {
        console.error('Failed to send message:', err)
        this.messageQueue.push({ type, data })
      }
    })

    return true
  }

  // 注册消息监听器
  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    this.listeners[type].push(callback)
  }

  // 处理接收到的消息
  handleMessage(data) {
    const { type, payload } = data
    const callbacks = this.listeners[type] || []
    
    callbacks.forEach(callback => {
      try {
        callback(payload)
      } catch (err) {
        console.error('Error in message handler:', err)
      }
    })
  }

  // 心跳检测
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.readyState === 1) {
        this.send('heartbeat', {})
      }
    }, 30000) // 30秒发送一次心跳
  }

  // 处理消息队列
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { type, data } = this.messageQueue.shift()
      this.send(type, data)
    }
  }

  // 安排重连
  scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.reconnectTimer = setTimeout(() => {
      console.log('Reconnecting...')
      this.connect()
    }, 5000) // 5秒后重连
  }

  // 关闭连接
  close() {
    if (this.socket) {
      this.socket.close()
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
  }
}

// 创建全局WebSocket实例
const wsClient = new WSClient()

// 导出WebSocket方法
export function connectWebSocket() {
  wsClient.connect()
}

export function sendWebSocketMessage(type, data) {
  return wsClient.send(type, data)
}

export function onWebSocketMessage(type, callback) {
  wsClient.on(type, callback)
}

export function closeWebSocket() {
  wsClient.close()
}
