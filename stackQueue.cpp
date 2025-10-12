#include <iostream>
#include <queue>
#include <stack>
using namespace std;

int main() {
    // -------- STACK (LIFO) --------
    cout << "=== STACK (LIFO) ===" << endl;

    // Declare a stack of integers
    stack<int> s;

    // Push elements onto the stack
    cout << "\nPushing elements 1, 2, 3 onto stack" << endl;
    s.push(1); // Push 1 onto stack
    s.push(2); // Push 2 onto stack
    s.push(3); // Push 3 onto stack

    // Print current top element
    cout << "Top element of stack: " << s.top() << endl; // Should be 3

    // Pop element from the stack
    cout << "Popping top element: " << s.top() << endl;
    s.pop(); // Remove top element

    // Print new top element after pop
    cout << "New top element of stack: " << s.top() << endl; // Should be 2

    // Print all elements by popping
    cout << "Remaining stack elements: ";
    while (!s.empty()) {
        cout << s.top() << " ";
        s.pop();
    }
    cout << endl;

    // -------- QUEUE (FIFO) --------
    cout << "\n=== QUEUE (FIFO) ===" << endl;

    // Declare a queue of integers
    queue<int> q;

    // Enqueue elements (add to rear)
    cout << "\nEnqueue elements 1, 2, 3 into queue" << endl;
    q.push(1); // Enqueue 1
    q.push(2); // Enqueue 2
    q.push(3); // Enqueue 3

    // Print front element
    cout << "Front element of queue: " << q.front() << endl; // Should be 1

    // Dequeue element (remove from front)
    cout << "Dequeuing front element: " << q.front() << endl;
    q.pop(); // Remove front element

    // Print new front element
    cout << "New front element of queue: " << q.front() << endl; // Should be 2

    // Print all elements by dequeuing
    cout << "Remaining queue elements: ";
    while (!q.empty()) {
        cout << q.front() << " ";
        q.pop();
    }
    cout << endl;

    return 0;
}
