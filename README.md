# learn-about-me
A social network application built it with Nodejs, Express and Mongodb

# Considerations
This example uses a module called bcrypt-node. This module is written in pure JavaScript just like most other modules so it’s easy to install. There’s another module on the npm registry called bcrypt, which requires some C code to be compiled. Compiled C code will be faster than pure JavaScript, but it can cause issues if your computer isn’t set up correctly for compiling C code. We use bcrypt-node in this example to avoid those issues here. THE BCRYPT-NODE MODULE When it’s time to get more speed, you should switch to the bcrypt module.Luckily, the faster module is almost identical once it’s installed, so it should be quick to swap it out.
