import { OrderService } from "../OrderService";
import { OrderRepository } from "@application/interfaces/order-repository.interface";
import { redisClient } from "@infrastructure/cache/redis-client";
import { mockUserId, mockOrders, mockOrder } from "../../../__tests__/setup";

const mockOrderRepository: jest.Mocked<OrderRepository> = {
  createOrder: jest.fn(),
  findOrdersByUserId: jest.fn(),
  findAllOrders: jest.fn(),
  findOrderById: jest.fn(),
  findOrderByTrackingCode: jest.fn(),
  findOrderWithTrackingById: jest.fn(),
  findOrderWithTrackingByTrackingCode: jest.fn(),
  updateOrderStatus: jest.fn(),
  getOrderStatusHistory: jest.fn(),
  addStatusToHistory: jest.fn(),
};

const mockRedisClient = redisClient as jest.Mocked<typeof redisClient>;

describe("OrderService", () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService(mockOrderRepository);
    jest.clearAllMocks();
  });

  describe("getUserOrders", () => {
    it("should return cached orders when available", async () => {
      mockRedisClient.getUserOrdersFromCache.mockResolvedValue(mockOrders);

      const result = await orderService.getUserOrders(mockUserId);

      expect(result).toEqual(mockOrders);
      expect(mockRedisClient.getUserOrdersFromCache).toHaveBeenCalledWith(
        mockUserId
      );
      expect(mockOrderRepository.findOrdersByUserId).not.toHaveBeenCalled();
    });

    it("should fetch orders from database when cache is empty", async () => {
      mockRedisClient.getUserOrdersFromCache.mockResolvedValue(null);
      mockOrderRepository.findOrdersByUserId.mockResolvedValue(mockOrders);

      const result = await orderService.getUserOrders(mockUserId);

      expect(result).toEqual(mockOrders);
      expect(mockRedisClient.getUserOrdersFromCache).toHaveBeenCalledWith(
        mockUserId
      );
      expect(mockOrderRepository.findOrdersByUserId).toHaveBeenCalledWith(
        mockUserId
      );
    });

    it("should return empty array when no orders found", async () => {
      mockRedisClient.getUserOrdersFromCache.mockResolvedValue(null);
      mockOrderRepository.findOrdersByUserId.mockResolvedValue([]);

      const result = await orderService.getUserOrders(mockUserId);

      expect(result).toEqual([]);
      expect(mockOrderRepository.findOrdersByUserId).toHaveBeenCalledWith(
        mockUserId
      );
    });

    it("should handle Redis errors gracefully", async () => {
      mockRedisClient.getUserOrdersFromCache.mockRejectedValue(
        new Error("Redis error")
      );
      mockOrderRepository.findOrdersByUserId.mockResolvedValue(mockOrders);

      const result = await orderService.getUserOrders(mockUserId);

      expect(result).toEqual(mockOrders);
      expect(mockOrderRepository.findOrdersByUserId).toHaveBeenCalledWith(
        mockUserId
      );
    });
  });

  describe("getAllOrders", () => {
    it("should return all orders from repository", async () => {
      mockOrderRepository.findAllOrders.mockResolvedValue(mockOrders);

      const result = await orderService.getAllOrders();

      expect(result).toEqual(mockOrders);
      expect(mockOrderRepository.findAllOrders).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no orders exist", async () => {
      mockOrderRepository.findAllOrders.mockResolvedValue([]);

      const result = await orderService.getAllOrders();

      expect(result).toEqual([]);
      expect(mockOrderRepository.findAllOrders).toHaveBeenCalledTimes(1);
    });
  });

  describe("getOrderById", () => {
    it("should return order when found", async () => {
      const orderId = 1;
      mockOrderRepository.findOrderById.mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(orderId);

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.findOrderById).toHaveBeenCalledWith(orderId);
    });

    it("should return null when order not found", async () => {
      const orderId = 999;
      mockOrderRepository.findOrderById.mockResolvedValue(null);

      const result = await orderService.getOrderById(orderId);

      expect(result).toBeNull();
      expect(mockOrderRepository.findOrderById).toHaveBeenCalledWith(orderId);
    });
  });
});
