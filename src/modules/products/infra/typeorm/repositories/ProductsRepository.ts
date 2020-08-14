import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        name,
      }
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const allProducts = await this.ormRepository.findByIds(products);

    return allProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
      const productsToUpdate = await this.findAllById(products);

      const productsUpdated = productsToUpdate.map(
        productToUpdate => {
          const quantity = products.find(
            productPurchased => productPurchased.id === productToUpdate.id
          )?.quantity

          if (quantity) {
            productToUpdate.quantity = productToUpdate.quantity - quantity;
          }

          return productToUpdate
        })

      return await this.ormRepository.save(productsUpdated);
  }
}

export default ProductsRepository;
