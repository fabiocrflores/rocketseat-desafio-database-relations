import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IProductOrder {
  product_id: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const productOrder: IProductOrder[] = []

    const customer = await this.customersRepository.findById(customer_id);

    if(!customer) {
      throw new AppError('Customer not exist');
    }

    const purchasedProducts = await this.productsRepository.findAllById(products);

    products.map(product => {
      const purchasedProduct = purchasedProducts.find(
        purchasedProduct => purchasedProduct.id === product.id
      );
      if(!purchasedProduct) {
        throw new AppError('Product not exist');
      }

      if(purchasedProduct.quantity < product.quantity) {
        throw new AppError('Product not available in stock');
      }

      productOrder.push({
        product_id: product.id,
        price: purchasedProduct.price,
        quantity: product.quantity,
      })
    });

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer,
      products: productOrder,
    });

    return order;
  }
}

export default CreateOrderService;
