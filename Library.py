# ============================================
# Library Management System (200+ Lines)
# Console Based – Python
# ============================================

import os

DATA_FILE = "library_data.txt"

# --------------------------------------------
# Utility Functions
# --------------------------------------------

def pause():
    input("\nPress Enter to continue...")

def clear():
    print("\n" * 5)

def file_exists():
    return os.path.exists(DATA_FILE)

# --------------------------------------------
# File Handling Functions
# --------------------------------------------

def load_books():
    books = []
    if file_exists():
        with open(DATA_FILE, "r") as file:
            for line in file:
                data = line.strip().split("|")
                book = {
                    "id": data[0],
                    "title": data[1],
                    "author": data[2],
                    "status": data[3]
                }
                books.append(book)
    return books

def save_books(books):
    with open(DATA_FILE, "w") as file:
        for book in books:
            file.write(
                f"{book['id']}|{book['title']}|{book['author']}|{book['status']}\n"
            )

# --------------------------------------------
# Core Library Functions
# --------------------------------------------

def add_book():
    clear()
    print("=== Add New Book ===\n")

    book_id = input("Enter Book ID: ")
    title = input("Enter Book Title: ")
    author = input("Enter Author Name: ")

    books = load_books()

    for book in books:
        if book["id"] == book_id:
            print("\nBook ID already exists!")
            pause()
            return

    new_book = {
        "id": book_id,
        "title": title,
        "author": author,
        "status": "Available"
    }

    books.append(new_book)
    save_books(books)

    print("\nBook added successfully!")
    pause()

def view_books():
    clear()
    print("=== View All Books ===\n")

    books = load_books()

    if not books:
        print("No books found.")
        pause()
        return

    for book in books:
        print(f"ID     : {book['id']}")
        print(f"Title  : {book['title']}")
        print(f"Author : {book['author']}")
        print(f"Status : {book['status']}")
        print("-" * 30)

    pause()

def search_book():
    clear()
    print("=== Search Book ===\n")

    keyword = input("Enter Book ID or Title: ").lower()
    books = load_books()
    found = False

    for book in books:
        if keyword in book["id"].lower() or keyword in book["title"].lower():
            print("\nBook Found:")
            print(f"ID     : {book['id']}")
            print(f"Title  : {book['title']}")
            print(f"Author : {book['author']}")
            print(f"Status : {book['status']}")
            found = True

    if not found:
        print("\nNo matching book found.")

    pause()

def issue_book():
    clear()
    print("=== Issue Book ===\n")

    book_id = input("Enter Book ID to issue: ")
    books = load_books()

    for book in books:
        if book["id"] == book_id:
            if book["status"] == "Issued":
                print("\nBook is already issued.")
            else:
                book["status"] = "Issued"
                save_books(books)
                print("\nBook issued successfully!")
            pause()
            return

    print("\nBook not found.")
    pause()

def return_book():
    clear()
    print("=== Return Book ===\n")

    book_id = input("Enter Book ID to return: ")
    books = load_books()

    for book in books:
        if book["id"] == book_id:
            if book["status"] == "Available":
                print("\nBook is already available.")
            else:
                book["status"] = "Available"
                save_books(books)
                print("\nBook returned successfully!")
            pause()
            return

    print("\nBook not found.")
    pause()

def delete_book():
    clear()
    print("=== Delete Book ===\n")

    book_id = input("Enter Book ID to delete: ")
    books = load_books()
    new_books = []
    deleted = False

    for book in books:
        if book["id"] == book_id:
            deleted = True
        else:
            new_books.append(book)

    if deleted:
        save_books(new_books)
        print("\nBook deleted successfully!")
    else:
        print("\nBook not found.")

    pause()

# --------------------------------------------
# Menu System
# --------------------------------------------

def main_menu():
    while True:
        clear()
        print("===== Library Management System =====\n")
        print("1. Add Book")
        print("2. View Books")
        print("3. Search Book")
        print("4. Issue Book")
        print("5. Return Book")
        print("6. Delete Book")
        print("7. Exit")

        choice = input("\nEnter your choice: ")

        if choice == "1":
            add_book()
        elif choice == "2":
            view_books()
        elif choice == "3":
            search_book()
        elif choice == "4":
            issue_book()
        elif choice == "5":
            return_book()
        elif choice == "6":
            delete_book()
        elif choice == "7":
            print("\nThank you for using Library Management System!")
            break
        else:
            print("\nInvalid choice!")
            pause()

# --------------------------------------------
# Program Entry Point
# --------------------------------------------

main_menu()