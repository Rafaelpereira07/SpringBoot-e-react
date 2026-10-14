import { api } from '@/lib/api'
import type { CertificateValidation } from '@/types'

export const certificateService = {
  validate: (code: string) => api.get<CertificateValidation>(`/certificates/${code}/validate`),
  downloadUrl: (code: string) => `${api.defaults.baseURL}/certificates/${code}`,
}
