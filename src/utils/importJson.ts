// JSON import and validation — full implementation in Step 5
export function validateAndParseProject(json: unknown): { ok: true; data: any } | { ok: false; error: string } {
  if (!json || typeof json !== 'object') {
    return { ok: false, error: 'JSON 数据格式不正确' }
  }
  const data = json as Record<string, any>
  if (!data.schemaVersion || typeof data.schemaVersion !== 'string') {
    return { ok: false, error: '缺少 schemaVersion 字段' }
  }
  if (!data.project || typeof data.project !== 'object') {
    return { ok: false, error: '缺少 project 字段' }
  }
  if (!Array.isArray(data.project.slides) || data.project.slides.length === 0) {
    return { ok: false, error: 'slides 字段必须是非空数组' }
  }
  return { ok: true, data: data as any }
}
