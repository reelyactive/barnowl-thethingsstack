barnowl-thethingsstack
======================

__barnowl-thethingsstack__ converts the decodings of _any_ ambient LoRaWAN devices by [The Things Stack](https://www.thethingsindustries.com/stack/) into standard developer-friendly JSON that is vendor/technology/application-agnostic.

![Overview of barnowl-thethingsstack](https://reelyactive.github.io/barnowl-thethingsstack/images/overview.png)

__barnowl-thethingsstack__ is a lightweight [Node.js package](https://www.npmjs.com/package/barnowl-thethingsstack) that can run on resource-constrained edge devices as well as on powerful cloud servers and anything in between.  It is included in reelyActive's [Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere/) open source middleware suite, and can just as easily be run standalone behind a [barnowl](https://github.com/reelyactive/barnowl) instance, as detailed in the code examples below.


Getting Started
---------------

Learn "owl" about the __raddec__ JSON data output:
-  [reelyActive Developer's Cheatsheet](https://reelyactive.github.io/diy/cheatsheet/)


Quick Start
-----------

Clone this repository, install package dependencies with `npm install`, and then from the root folder run at any time:

    npm start

__barnowl-thethingsstack__ will indiscriminately accept HTTP POSTs of [uplink messages](https://www.thethingsindustries.com/docs/the-things-stack/concepts/data-formats/#uplink-messages) on localhost:3001/thethingsstack and output (flattened) __raddec__ JSON to the console.


Hello barnowl-thethingsstack!
-----------------------------

Developing an application directly from __barnowl-thethingsstack__?  Start by pasting the code below into a file called server.js:

```javascript
const Barnowl = require('barnowl');
const BarnowlTheThingsStack = require('barnowl-thethingsstack');

let barnowl = new Barnowl({ enableMixing: true });

barnowl.addListener(BarnowlTheThingsStack, {},
                    BarnowlTheThingsStack.HttpListener, { port: 3001 });

barnowl.on('raddec', (raddec) => {
  console.log(raddec);
  // Trigger your application logic here
});
```

From the same folder as the server.js file, install package dependencies with the commands `npm install barnowl-thethingsstack` and `npm install barnowl`.  Then run the code with the command `node server.js` and observe the stream of radio decodings (raddec objects) output to the console:

```javascript
{
  transmitterId: "70b3d57ed8001e9e",
  transmitterIdType: 1,
  rssiSignature: [
    {
      receiverId: "001bc50940840000",
      receiverIdType: 1,
      rssi: -99,
      numberOfDecodings: 1
    }
  ],
  packets: [ "1d02ba02ca00" ],
  timestamp: 1645568542222
}
```

See the [Supported Listener Interfaces](#supported-listener-interfaces) below to adapt the code to listen for your stack(s).


Supported Listener Interfaces
-----------------------------

The following listener interfaces are supported by __barnowl-thethingsstack__.  Extend the [Hello barnowl-thethingsstack!](#hello-barnowl-thethingsstack) example above by pasting in any of the code snippets below.

### HTTP

The _recommended_ implementation is using [express](https://expressjs.com/) as follows:

```javascript
const express = require('express');
const http = require('http');

let app = express();
let server = http.createServer(app);
server.listen(3001, function() { console.log('Listening on port 3001'); });

let options = { app: app, express: express, route: "/thethingsstack" }; 
barnowl.addListener(BarnowlTheThingsStack, {},
                    BarnowlTheThingsStack.HttpListener, options);
```

Nonetheless, for testing purposes, __barnowl-thethingsstack__ can also create a minimal HTTP server as an alternative to express, and attempt to handle any POST it receives:

```javascript
barnowl.addListener(BarnowlTheThingsStack, {},
                    BarnowlTheThingsStack.HttpListener, { port: 3001 });
```

### Test

Provides a steady stream of simulated IoT Device Interface messages for testing purposes.

```javascript
barnowl.addListener(BarnowlTheThingsStack, {},
                    BarnowlTheThingsStack.TestListener, {});
```


Is that owl you can do?
-----------------------

While __barnowl-thethingsstack__ may suffice standalone for simple real-time applications, its functionality can be greatly extended with the following software packages:
- [barnowl](https://github.com/reelyactive/barnowl) to combine parallel streams of RF decoding data in a technology-and-vendor-agnostic way

These packages and more are bundled together as the [Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere) open source middleware suite, which includes a variety of __barnowl-x__ listeners, APIs and interactive web apps.


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2023 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.

