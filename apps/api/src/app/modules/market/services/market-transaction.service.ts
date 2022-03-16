import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CityProduct } from "../../../models/city-product.entity";
import { MarketTransaction } from "../../../models/market-transaction.entity";
import { Product } from "../../../models/product.entity";
import { MakeTradeInput } from "../models/make-trade-input.interface";

export class MarketTransactionService {
  private readonly logger = new Logger('MarketTransactionService');

  constructor(
    @InjectRepository(CityProduct)
    private cityProductRepository: Repository<CityProduct>,
    @InjectRepository(MarketTransaction)
    private transactionRepository: Repository<MarketTransaction>,
  ) { }

  /**
   * create a new MarketTransaction in the database
   *
   * @param input
   */
  public async makeTrade(input: MakeTradeInput) {
    await this.sendMoney(input);
    await this.receiveMoney(input);
    await this.shipProduct(input);
    await this.receiveProduct(input);
    const newTransaction = await this.transactionRepository.save(input);
    await this.updateMarketPrice(input.product);
    return newTransaction
  }

  /**
   * Reduces sellers product stock by the amount in the transaction.
   *
   * @param transaction
   */
  private async shipProduct(transaction: MakeTradeInput) {
    const sellerProductStock = (
      await this.cityProductRepository.findOneOrFail({
        city: transaction.seller,
        product: transaction.product,
      })
    ).amount;
    this.cityProductRepository.update(
      { city: transaction.seller, product: transaction.product },
      { amount: sellerProductStock - transaction.quantity }
    );
  }

  /**
   * Increases purchasers product stock by the amount in the transaction.
   *
   * @param transaction
   */
  private async receiveProduct(transaction: MakeTradeInput) {
    const purchaserProductStock = (
      await this.cityProductRepository.findOneOrFail({
        city: transaction.purchaser,
        product: transaction.product,
      })
    ).amount;
    this.cityProductRepository.update(
      { city: transaction.seller, product: transaction.product },
      { amount: purchaserProductStock + transaction.quantity }
    );
  }

  /**
   * Reduces purchasers money by the price of the transaction
   *
   * @param transaction
   */
  private async sendMoney(transaction: MakeTradeInput) {
    const purchasingPrice = transaction.quantity * transaction.price;
    this.logger.warn(
      `There is not money in the economy. Not sending ${purchasingPrice} habitrons`
    );
  }

  /**
   * Increases sellers money by the price of the transaction
   *
   * @param transaction
   */
  private async receiveMoney(transaction: MakeTradeInput) {
    this.logger.warn('There is not money in the economy');
  }

  private async updateMarketPrice(product: Product) {
    const last100MarketTransactions = await this.transactionRepository.find({ where: { product }, order: { date: "DESC" }, take: 100 });
    const last10 = last100MarketTransactions.slice(0, 10);
    const last25 = last100MarketTransactions.slice(0, 25);
    const last100 = last100MarketTransactions;
    const averageLast10 = this.getAverage(last10.map(marketTransaction => marketTransaction.price), last10.map(marketTransaction => marketTransaction.quantity));
    // await this.marketPriceRepository.save()
  }

  private getAverage(data: number[], weights: number[]): number | undefined {
    if (data.length !== weights.length) {
      return;
    }
    let weightedSum = 0
    for (let i = 0; i++; i < data.length) {
      weightedSum += data[i] * weights[i];
    }
    const average = weightedSum / weights.reduce((a, b) => a + b)
  }
}
