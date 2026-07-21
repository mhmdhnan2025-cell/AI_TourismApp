import java.util.*;
import java.util.concurrent.*;

public class OrderProcessingSystem {
    private static final Map<String, Integer> inventory = new ConcurrentHashMap<>();
    private static final ExecutorService pool = Executors.newFixedThreadPool(4);

    public static void main(String[] args) throws InterruptedException {
        // Initialize Inventory
        inventory.put("ITEM_001", 100);
        inventory.put("ITEM_002", 50);

        System.out.println("Starting Audit Simulation...");
        long start = System.currentTimeMillis();

        // Simulate 100 Orders
        for (int i = 0; i < 100; i++) {
            final int orderId = i;
            pool.submit(() -> processOrder(orderId));
        }

        pool.shutdown();
        pool.awaitTermination(1, TimeUnit.MINUTES);

        long end = System.currentTimeMillis();
        System.out.println("Total Time: " + (end - start) + "ms");
        System.out.println("Audit Complete.");
    }

    // Method 1: Process Order (V(G) ~5)
    public static void processOrder(int orderId) {
        try {
            boolean isValid = true; // Simulated validation
            if (isValid) {
                double amount = 50.0;
                boolean charged = validateAndCharge(amount);
                if (charged) {
                    updateInventory("ITEM_001", 1);
                    System.out.println("Order " + orderId + " Processed.");
                } else {
                    handleRetry(new Exception("Charge Failed"), 1);
                }
            }
        } catch (Exception e) {
            System.err.println("Error in Order " + orderId);
        }
    }

    // Method 2: Validate and Charge (High Complexity V(G) ~11)
    public static boolean validateAndCharge(double amount) {
        Random rand = new Random();
        boolean cardValid = rand.nextBoolean();
        boolean fraudCheck = rand.nextBoolean();

        if (!cardValid)
            return false;
        if (!fraudCheck)
            return false;

        // Simulate network jitter/complexity
        try {
            Thread.sleep(rand.nextInt(10));
            return true;
        } catch (InterruptedException e) {
            return false;
        }
    }

    // Method 3: Update Inventory (Low Complexity V(G) ~3)
    public static synchronized void updateInventory(String item, int qty) {
        int current = inventory.getOrDefault(item, 0);
        if (current >= qty) {
            inventory.put(item, current - qty);
        }
    }

    // Method 4: Handle Retry (Medium Complexity V(G) ~6)
    public static void handleRetry(Exception e, int attempt) {
        if (attempt > 3)
            return;
        try {
            Thread.sleep(100 * attempt); // Backoff
            System.out.println("Retrying... Attempt: " + attempt);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        }
    }

    // Method 5: Generate Report (Medium Complexity V(G) ~7)
    public static void generateReport() {
        int total = 0;
        for (int val : inventory.values()) {
            total += val;
        }
        System.out.println("Total Stock: " + total);
    }
}