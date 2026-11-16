export interface Producto {
  id: string
  name: string
  description?: string
  category: 'Electrónica' | 'Accesorios' | 'Audio' | 'Cómputo' | string
  purchasePrice: number
  salePrice: number
  stock: number
  status: 'Activo' | 'Inactivo'
  imageUrl?: string
}