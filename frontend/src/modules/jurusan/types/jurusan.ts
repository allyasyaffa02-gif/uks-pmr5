export interface JurusanItem {
  id: number;
  name: string;
}

export interface CreateJurusanInput {
  name: string;
}

export type UpdateJurusanInput = CreateJurusanInput;