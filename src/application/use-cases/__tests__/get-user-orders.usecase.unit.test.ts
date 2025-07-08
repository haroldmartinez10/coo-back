import {
  mockAdminUserId,
  mockOrder,
  mockOrders,
  mockUserId,
} from "../../../__tests__/setup";
import { GetUserOrdersUseCase } from "../get-user-orders.usecase";
import { OrderService } from "@application/services/OrderService";

const mockOrderService: jest.Mocked<OrderService> = {
  createOrder: jest.fn(),
  getUserOrders: jest.fn(),
  getAllOrders: jest.fn(),
  getOrderById: jest.fn(),
  getOrderByTrackingCode: jest.fn(),
  getOrderTracking: jest.fn(),
  getOrderTrackingByCode: jest.fn(),
  updateOrderStatus: jest.fn(),
  getOrderStatusHistory: jest.fn(),
  getOrderStatusHistoryWithDetails: jest.fn(),
  validateBasePrice: jest.fn(),
} as unknown as jest.Mocked<OrderService>;

describe("GetUserOrdersUseCase", () => {
  let useCase: GetUserOrdersUseCase;

  beforeEach(() => {
    useCase = new GetUserOrdersUseCase(mockOrderService);
    jest.clearAllMocks();
  });

  describe("getUserOrders", () => {
    it("should return user orders for regular user and admin orders for admin", async () => {
      mockOrderService.getUserOrders.mockResolvedValue(mockOrders);

      const userResult = await useCase.getUserOrders(mockUserId, false);
      expect(userResult).toEqual(mockOrders);
      expect(mockOrderService.getUserOrders).toHaveBeenCalledWith(mockUserId);

      jest.clearAllMocks();
      const adminOrders = [...mockOrders, { ...mockOrders[0], id: 999 }];
      mockOrderService.getAllOrders.mockResolvedValue(adminOrders);

      const adminResult = await useCase.getUserOrders(mockUserId, true);
      expect(adminResult).toEqual(adminOrders);
      expect(mockOrderService.getAllOrders).toHaveBeenCalledTimes(1);
      expect(mockOrderService.getUserOrders).not.toHaveBeenCalled();
    });

    it("should return all orders when user is admin", async () => {
      const isAdmin = true;
      const allOrders = [
        ...mockOrders,
        { ...mockOrder, id: 3, userId: 2, trackingCode: "COO-111111111" },
      ];
      mockOrderService.getAllOrders.mockResolvedValue(allOrders);

      const result = await useCase.getUserOrders(mockAdminUserId, isAdmin);

      expect(result).toEqual(allOrders);
      expect(mockOrderService.getAllOrders).toHaveBeenCalledTimes(1);
      expect(mockOrderService.getUserOrders).not.toHaveBeenCalled();
    });

    it("should default to non-admin behavior when isAdmin is not provided", async () => {
      mockOrderService.getUserOrders.mockResolvedValue(mockOrders);

      const result = await useCase.getUserOrders(mockUserId);

      expect(result).toEqual(mockOrders);
      expect(mockOrderService.getUserOrders).toHaveBeenCalledWith(mockUserId);
      expect(mockOrderService.getAllOrders).not.toHaveBeenCalled();
    });

    it("should return empty array when user has no orders", async () => {
      const isAdmin = false;
      mockOrderService.getUserOrders.mockResolvedValue([]);

      const result = await useCase.getUserOrders(mockUserId, isAdmin);

      expect(result).toEqual([]);
      expect(mockOrderService.getUserOrders).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty array when admin has no orders to show", async () => {
      const isAdmin = true;
      mockOrderService.getAllOrders.mockResolvedValue([]);

      const result = await useCase.getUserOrders(mockAdminUserId, isAdmin);

      expect(result).toEqual([]);
      expect(mockOrderService.getAllOrders).toHaveBeenCalledTimes(1);
    });

    it("should propagate errors from OrderService.getUserOrders", async () => {
      const isAdmin = false;
      const error = new Error("Database connection failed");
      mockOrderService.getUserOrders.mockRejectedValue(error);

      await expect(useCase.getUserOrders(mockUserId, isAdmin)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockOrderService.getUserOrders).toHaveBeenCalledWith(mockUserId);
    });

    it("should propagate errors from OrderService.getAllOrders", async () => {
      const isAdmin = true;
      const error = new Error("Database connection failed");
      mockOrderService.getAllOrders.mockRejectedValue(error);

      await expect(
        useCase.getUserOrders(mockAdminUserId, isAdmin)
      ).rejects.toThrow("Database connection failed");
      expect(mockOrderService.getAllOrders).toHaveBeenCalledTimes(1);
    });
  });
});
