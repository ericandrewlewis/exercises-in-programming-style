#!/usr/bin/env python
import sys, re, operator, string, pdb
#
# The all-important data stack
#
class Stack:
    def __init__(self):
        self.data = []

    def push(self, item):
        self.data.append(item)

    def pop(self):
        return self.data.pop()

    def peek(self):
        return self.data[-1]

    def empty(self):
        return len(self.data) == 0
stack = Stack()

#
# The heap. Maps names to data (i.e. variables)
#
heap = {}

#
# The new "words" (procedures) of our program
#
def read_file():
    """
    Takes a path to a file on the stack and places the entire
    contents of the file back on the stack.
    """
    f = open(stack.pop())
    # Push the result onto the stack
    stack.push([f.read()])
    f.close()

def filter_chars():
    """
    Takes data on the stack and places back a copy with all
    nonalphanumeric chars replaced by white space.
    """
    # This is not in style. RE is too high-level, but using it
    # for doing this fast and short. Push the pattern onto stack
    stack.push(re.compile('[\W_]+'))
    # Push the result onto the stack
    stack.push([stack.pop().sub(' ', stack.pop()[0]).lower()])

def scan():
    """
    Takes a string on the stack and scans for words, placing
    the list of words back on the stack
    """
    # Again, split() is too high-level for this style, but using
    # it for doing this fast and short. Left as exercise.
    heap['words'] = stack.pop()[0].split()
    heap['words'].reverse()
    while len(heap['words']) > 0:
        stack.push(heap['words'].pop())

def remove_stop_words():
    """
    Takes a list of words on the stack and removes stop words.
    """
    f = open('../stop_words.txt')
    stack.push(f.read().split(','))
    f.close()

    # add single-letter words
    # stack.push(stack.pop().extend(list(string.ascii_lowercase)))
    stack.push(stack.pop())
    heap['stop_words'] = stack.pop()

    # Again, this is too high-level for this style, but using it
    # for doing this fast and short. Left as exercise.
    heap['words'] = []
    while not stack.empty():
        if stack.peek() in heap['stop_words']:
            stack.pop() # pop it and drop it
        else:
            heap['words'].append(stack.pop()) # pop it, store it
    # Load the words onto the stack
    heap['words'].reverse()
    while len(heap['words']) > 0:
        stack.push(heap['words'].pop())
    del heap['stop_words']; del heap['words'] # Not needed

def frequencies():
    """
    Takes a list of words and returns a dictionary associating
    words with frequencies of occurrence.
    """
    heap['word_freqs'] = {}
    # A little flavour of the real Forth style here...
    while not stack.empty():
        # ... but the following line is not in style, because the
        # naive implementation would be too slow
        if stack.peek() in heap['word_freqs']:
            # Increment the frequency, postfix style: f 1 +
            stack.push(heap['word_freqs'][stack.peek()]) # push f
            stack.push(1) # push 1
            stack.push(stack.pop() + stack.pop()) # add
        else:
            stack.push(1) # Push 1 in stack[2]
        # Load the updated freq back onto the heap
        heap['word_freqs'][stack.pop()] = stack.pop()

    # Push the result onto the stack
    stack.push(heap['word_freqs'])
    del heap['word_freqs'] # We don't need this variable anymore

def sort():
    # Not in style, left as exercise
    heap['sorted'] = sorted(stack.pop().iteritems(), key=operator.itemgetter(1))
    heap['sorted'].reverse()
    while len(heap['sorted']) > 0:
        stack.push(heap['sorted'].pop())
    del heap['sorted']

# The main function
#
stack.push(sys.argv[1])
read_file(); filter_chars(); scan(); remove_stop_words()
frequencies(); sort()


stack.push(0)

# Check stack length against 1, because after we process
# the last word there will be one item left
while stack.peek() < 25 and not stack.empty():
    heap['i'] = stack.pop()
    (w, f) = stack.pop(); print w, ' - ', f
    stack.push(heap['i']); stack.push(1)
    stack.push(stack.pop() + stack.pop())
