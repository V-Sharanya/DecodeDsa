#include <iostream>
using namespace std;

// Define a Node of a Binary Tree
struct Node {
    int data;       // Value of the node
    Node* left;     // Pointer to left child
    Node* right;    // Pointer to right child

    Node(int val) {
        data = val;
        left = nullptr;
        right = nullptr;
    }
};

// -------- INORDER TRAVERSAL (Left, Root, Right) --------
void inorder(Node* root) {
    if (root == nullptr) return;   // Base case: empty node
    inorder(root->left);           // Traverse left subtree
    cout << root->data << " ";     // Visit root node
    inorder(root->right);          // Traverse right subtree
}

// -------- PREORDER TRAVERSAL (Root, Left, Right) --------
void preorder(Node* root) {
    if (root == nullptr) return;   // Base case: empty node
    cout << root->data << " ";     // Visit root node first
    preorder(root->left);          // Traverse left subtree
    preorder(root->right);         // Traverse right subtree
}

// -------- POSTORDER TRAVERSAL (Left, Right, Root) --------
void postorder(Node* root) {
    if (root == nullptr) return;   // Base case: empty node
    postorder(root->left);         // Traverse left subtree
    postorder(root->right);        // Traverse right subtree
    cout << root->data << " ";     // Visit root node at the end
}

int main() {
    /*
        Let's build this binary tree as an example:

                 1
               /   \
              2     3
             / \   / 
            4   5 6  

    */

    Node* root = new Node(1);
    root->left = new Node(2);
    root->right = new Node(3);
    root->left->left = new Node(4);
    root->left->right = new Node(5);
    root->right->left = new Node(6);

    cout << "Inorder Traversal (Left, Root, Right): ";
    inorder(root);
    cout << endl;

    cout << "Preorder Traversal (Root, Left, Right): ";
    preorder(root);
    cout << endl;

    cout << "Postorder Traversal (Left, Right, Root): ";
    postorder(root);
    cout << endl;

    return 0;
}
