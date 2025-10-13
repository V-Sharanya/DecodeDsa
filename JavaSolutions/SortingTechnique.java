// Java/SortingTechnique.java
// Hacktoberfest 2025 Contribution
// Beginner-friendly Bubble Sort implementation
// Shows sorting steps and displays the final sorted array separately

package DecodeDsa.JavaSolutions;

import java.util.Arrays;
import java.util.Scanner;

public class SortingTechnique {

    // Function to perform Bubble Sort
    public static void bubbleSort(int[] arr) {
        int n = arr.length;

        System.out.println("\n🔹 Sorting Steps:");
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;

            // Compare adjacent elements
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements if they are in the wrong order
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }

            // Show array after each pass
            System.out.println("Step " + (i + 1) + ": " + Arrays.toString(arr));

            // If no swaps, array is already sorted
            if (!swapped) break;
        }

        // After all steps, show final sorted array separately
        System.out.println("\n✅ Final Sorted Array: " + Arrays.toString(arr));
    }

    // Main method to test the sorting
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter number of elements: ");
        int n = sc.nextInt();

        int[] arr = new int[n];
        System.out.println("Enter " + n + " numbers:");
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }

        System.out.println("\nOriginal Array: " + Arrays.toString(arr));
        bubbleSort(arr);

        sc.close();
    }
}
