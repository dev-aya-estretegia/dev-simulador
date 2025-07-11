export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      empreendimento: {
        // Nome da tabela em minúsculas
        Row: {
          id: number
          nome: string
          descricao: string
          endereco: string
          cidade: string
          estado: string
          data_lancamento: string
          data_entrega: string
          vgv_alvo: number
          percentual_permuta: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          nome: string
          descricao: string
          endereco: string
          cidade: string
          estado: string
          data_lancamento: string
          data_entrega: string
          vgv_alvo: number
          percentual_permuta: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          nome?: string
          descricao?: string
          endereco?: string
          cidade?: string
          estado?: string
          data_lancamento?: string
          data_entrega?: string
          vgv_alvo?: number
          percentual_permuta?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      EMPREENDIMENTO: {
        Row: {
          id: number
          nome: string
          descricao: string
          endereco: string
          data_lancamento: string
          data_entrega: string
          vgv_alvo: number
          percentual_permuta: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          nome: string
          descricao: string
          endereco: string
          data_lancamento: string
          data_entrega: string
          vgv_alvo: number
          percentual_permuta: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          nome?: string
          descricao?: string
          endereco?: string
          data_lancamento?: string
          data_entrega?: string
          vgv_alvo?: number
          percentual_permuta?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      UNIDADE: {
        Row: {
          id: number
          empreendimento_id: number
          nome: string
          tipologia: string
          area_privativa: number
          area_garden: number | null
          pavimento: number
          bloco: string
          orientacao_solar: string
          vista: string | null
          diferencial: string | null
          qtd_vaga_simples: number
          qtd_vaga_duplas: number
          qtd_vaga_moto: number
          qtd_hobby_boxes: number
          qtd_suite: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          empreendimento_id: number
          nome: string
          tipologia: string
          area_privativa: number
          area_garden?: number | null
          pavimento: number
          bloco: string
          orientacao_solar: string
          vista?: string | null
          diferencial?: string | null
          qtd_vaga_simples: number
          qtd_vaga_duplas: number
          qtd_vaga_moto: number
          qtd_hobby_boxes: number
          qtd_suite: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          empreendimento_id?: number
          nome?: string
          tipologia?: string
          area_privativa?: number
          area_garden?: number | null
          pavimento?: number
          bloco?: string
          orientacao_solar?: string
          vista?: string | null
          diferencial?: string | null
          qtd_vaga_simples?: number
          qtd_vaga_duplas?: number
          qtd_vaga_moto?: number
          qtd_hobby_boxes?: number
          qtd_suite?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // Outras tabelas seguiriam o mesmo padrão...
    }
    Views: {
      VIEW_INDICADORES_CENARIO: {
        Row: {
          cenario_id: number
          vgv_inicial: number
          vgv_final: number
          diferenca_percentual: number
          valor_medio_m2_apartamento: number
          valor_medio_m2_studio: number
          valor_medio_m2_comercial: number
          total_unidades: number
        }
      }
      VIEW_VGV_POR_FASE: {
        Row: {
          cenario_id: number
          fase_nome: string
          vgv_fase: number
          percentual_do_total: number
          qtd_unidades: number
        }
      }
      VIEW_VGV_POR_TIPOLOGIA: {
        Row: {
          cenario_id: number
          tipologia: string
          vgv_tipologia: number
          percentual_do_total: number
          qtd_unidades: number
          valor_medio_m2: number
        }
      }
      // Outras views seguiriam o mesmo padrão...
    }
    Functions: {
      fn_calcular_valores_unidade: {
        Args: {
          p_unidade_id: number
          p_cenario_id: number
        }
        Returns: {
          valor_unidade_inicial: number
          valor_unidade_venda: number
        }
      }
      fn_calcular_valores_fases: {
        Args: {
          p_unidade_id: number
          p_cenario_id: number
        }
        Returns: {
          fase_1: number
          fase_2: number
          fase_3: number
          fase_4: number
          fase_5: number
          fase_6: number
          fase_7: number
          fase_8: number
          fase_9: number
          fase_10: number
        }
      }
      fn_alocar_unidades_fase: {
        Args: {
          p_fase_id: number
          p_unidades_ids: number[]
        }
        Returns: number
      }
      fn_calcular_indicadores_cenario: {
        Args: {
          p_cenario_id: number
        }
        Returns: {
          vgv_inicial: number
          vgv_final: number
          diferenca_percentual: number
        }
      }
      // Outras funções seguiriam o mesmo padrão...
    }
  }
}
