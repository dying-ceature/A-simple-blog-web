/**
 * @file jwt.ts
 * @description 模拟 JWT 工具函数，生成三段式 token 结构。
 */

/**
 * @description base64url 编码（JWT 标准编码，非标准 base64）。
 */
function base64url(str: string): string {
  // 浏览器环境使用 btoa
  const base64 = btoa(unescape(encodeURIComponent(str)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * @description base64url 解码。
 */
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  // 补齐 padding
  while (base64.length % 4) {
    base64 += '='
  }
  return decodeURIComponent(escape(atob(base64)))
}

/**
 * @description JWT Payload 结构。
 */
export interface JWTPayload {
  sub: string       // 用户名
  iat: number       // 签发时间 (Unix timestamp)
  exp: number       // 过期时间 (Unix timestamp)
  [key: string]: unknown
}

/**
 * @description 创建模拟 JWT token。
 * 格式: header.payload.signature
 */
export function createMockJWT(payload: Partial<JWTPayload> & { sub: string }): string {
  const now = Math.floor(Date.now() / 1000)

  const header = { alg: 'HS256', typ: 'JWT' }
  const fullPayload: JWTPayload = {
    sub: payload.sub,
    iat: payload.iat ?? now,
    exp: payload.exp ?? now + 24 * 60 * 60, // 默认 24 小时过期
    ...payload,
  }

  const headerEncoded = base64url(JSON.stringify(header))
  const payloadEncoded = base64url(JSON.stringify(fullPayload))
  // 模拟签名：header + payload 的简单 hash（非真实 HMAC-SHA256）
  const signature = base64url(
    `${headerEncoded}.${payloadEncoded}.mock-secret`
  ).substring(0, 43)

  return `${headerEncoded}.${payloadEncoded}.${signature}`
}

/**
 * @description 解码模拟 JWT token，返回 payload 对象。
 * 不做签名验证（因为是 mock token）。
 */
export function decodeMockJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(base64urlDecode(parts[1]))
    return payload as JWTPayload
  } catch {
    return null
  }
}

/**
 * @description 检查 token 是否已过期。
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeMockJWT(token)
  if (!payload) return true
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}
