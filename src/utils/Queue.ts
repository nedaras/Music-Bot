/* eslint-disable @typescript-eslint/no-non-null-assertion */
class Queue<T> {

    private head: Node<T> | null = null
    private tail: Node<T> | null = null

    public length = 0

    push(value: T) {

        if (this.isEmpty()) { this.head = this.tail = new Node<T>(value, null, null) } else {
            
            this.head!.previous = new Node(value, null, this.head)
            this.head = this.head!.previous

        }

        this.length++

    }

    pop() {

        if (this.isEmpty()) throw new Error('Cannot remove last element from empty Queue.')

        const value = this.tail!.value
        this.tail = this.tail!.previous

        this.length--

        if (this.isEmpty()) this.head = null
        else this.tail!.next = null

        return value

    }

    getLast() {

        if (this.isEmpty()) throw new Error('Cannot get last element from empty Queue.')

        return this.tail!.value

    }

    isEmpty = () => this.length === 0

}

class Node<T> { constructor(public value: T, public previous: Node<T> | null, public next: Node<T> | null) {} }

export default Queue