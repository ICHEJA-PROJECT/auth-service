export interface TokenPayloadI {
  id_persona: number;
  nombre: string;
  role_name: string;
  disability_name?: string;
  disability_id?: number;
  learning_path_id?: number;
  iat?: number;
  exp?: number;
}
