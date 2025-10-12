#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}

int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {10, 3, 7, 1, 9, 5};
    int target = 7;

    cout << "Original Array: ";
    for (int val : arr) cout << val << " ";
    cout << endl;

    int linearResult = linearSearch(arr, target);
    cout << "Linear Search: ";
    if (linearResult != -1) cout << "Found at index " << linearResult << endl;
    else cout << "Not Found" << endl;

    sort(arr.begin(), arr.end());
    cout << "Sorted Array for Binary Search: ";
    for (int val : arr) cout << val << " ";
    cout << endl;

    int binaryResult = binarySearch(arr, target);
    cout << "Binary Search: ";
    if (binaryResult != -1) cout << "Found at index " << binaryResult << endl;
    else cout << "Not Found" << endl;

    return 0;
}
