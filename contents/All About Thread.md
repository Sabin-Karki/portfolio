
Firstly before Thread , need to know what is a process. Process is an independent running program which has its own memory ,own runtime , own resources and each process = running programs are independent to each other and their own thing . Thread meanwhile is a smaller execution unit inside a process where the program executes,essentially a path where a program execution takes place.Thread share same resources,memory,heaps,etc.A process can have 1 or more threads.

# Concurrency vs Parallelism

Concurrency is a mechanism where multiple tasks are done in an overlapping time , not exactly the SAME time . It is  a abilty for a program to progress where multiple tasks is ongoing . 
Parallelism is runnings multiple tasks at exact same time, Cpu performs this where each core of CPU can perform a certain task at exact same  time 

# Thread
The way thread works is it makes the app not breakdown, in  a process, a thread responsible for UI will keep the UI afloat while thread for a task responsible for something runs the task in background making the entire thing very seamless and responsive.
Threads share the same memory which could lead to a race conidtion problem meaning a thread can interrupt an operation being performed by another thread which alters the expected outcome for the thread.The interference happens because the operations may not be atomic(1 whole thing or nothing) leading to interupption.
==synchronized== is the keyword than used to prevent race condition as it is used in a method during declaration and then only one thread can enter at a time .. << 1. Thread enters the method 2.Synchronized locks the door of the method 3.other thread now wait >> 
Now while this lock mechanism solves the race condition where thread interrupt/sneak in corrupting the operation, it creates another set of problems like the deadlock condition,waiting and blocking which could have issue in concurrency .
SO this is why the ==Atomic== class is introduced to perform atomic operations meaning , doing multiple operations as one whole thing so that no thread can interrupt / sneak in all while preventing a deadlock condition where thread are locked forever . ==This is the solution for what volatile does not resolve , when volatile does solve visibilty set of problem ,it does not make sure that an operation which has multiple steps can go uninterrupted by another thread== 

# ExecutorService
creating raw thread every single time using the new Thread() is very expensive and resource constraining,therefore the executor sservice is used to create a thread pool by reusing existing thread..
Basically instead of trying to create a new single thread eveyr single tme,executorservice can be used to create a threadpool which runs on background and wait till a task is submitted to it.
this improves the performance , reduces the overhead.

ExecutorService  e  = Executors.newFixedThreadPool(5);
e.submit(()=>{sout("task")});

# Virtual Threads
SO the threads which were being created was by the OS when the jvm creates the thread object and makes a call to os kernel which then create and schedules the actual physcial  execution thread allowing the resources .. So as it is quite cleaar,the jvm needs this interaction with OS which could be quite hinderful and really constraint having to constantly make system calls to operating system 
The solution resulted in Virutal Threads,not only whose object and lifecycle was managed by jvm rather it is jvm which creates thousands of virtual thread .and it totally reduces the memory overhead which os would need to allocate.

Thread.startVirtualThread(()->{})

Trad Server= 1 request-1 expensive os thread
Virtual Thread server = 1 request-1 cheap virtual thread

ExecutorService executor =
    Executors.newVirtualThreadPerTaskExecutor();

executor.submit(() -> {
    System.out.println("Task");
});

lets assume a api call is being made,virtual thread is carrying out and during the idle state where the network call is beign made,instead of the os thread/carrier thread/platform thread wasting it resource as the virtual thread is mounted to it ,virtual thread demounts allowing the os thread to be free and allow it to accept other request , 


# Visibility Bug
It is one of the major bug related to thread and affecting concurrent task where multiple threads work . What the problem is that,Thread A writes a value however Thread B is not able to see the value .. simply meaning not all thread can see what one thread wrote . Threads reading a stale value and not the recent write of thread is what is a visibility problem

### Why it happens

Each CPU core has its own cache : L1 L2 L3 , Reading from cache is much quicker than reading from RAM , so  reading from cache is what is the default behavior for thread
Assume , Thread 1 cache = tokens:10  Thread 2 cache = tokens:10 
Thread 1 then sets token -> 8  and then it writes to thread 1 cache that token is 8 however doesnt update the RAM 
Thread 2 reads token ,it reads from it cache too , so it sees 10 instead of 8 ( the new value)

==THE SOLUTION== 
volatile - > private volatile long tokens; is what solves the visibilty problem. Volatile tells the jvm couple things , firstly that every write to this variable must go to RAM bypassing the cache and every read of this variable must come directly from RAM too instead of the cache . What it does is , it not only sets the updated value to RAM , it also makes sure every thread reads the newest value 



# Lock

Atomic Class fixes the race condition on one variable at atime ,however when multiple variabels are involved and they need to be consistent with each other,Atomic is not the most preventive thing to be used, instead this is where Locks come into the play

A lock is a coordination mechanism, one thread holds it and other thread wait for it, it protects a block of code from being interuppted by other thread and  makes the block appeare as one atomic operation regardless  of how many steps it has . Synchronized as mentioned before is the most simplest lock,which makes the method not being accessed by another thread when 1 thread is workign on it.
In this lock ,there is no seperation between read and write and both queue even though readers ofcourse dont corrupt each other . Hence , ==ReadWriteLock== is used which distinguishes writes and reads,in this type of lock,the read lock can be shared by multiple thread while the write lock is still exclusive to a thread

StampedLock is basically the RWLock but with the 3rd mode, which is tryOptimisticRead(), which is used when there is a lot of read operations ongoing and lock wont be needed ,and read is very faster because there is no lock.


 
