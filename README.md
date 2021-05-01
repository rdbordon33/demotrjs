# sirencall (a lightweight library for JSON Siren)

sirencall is a lightweight JS library for manipulating JSON Siren object.

## JSON Siren and hypermedia

[JSON Siren](https://github.com/kevinswiber/siren) is a JSON Hypermedia
format.

## Sirencall principles

Siren format can be viewed as an envelop around the payload of your object
defined by the properties attribute. This way a Siren document makes a clear
distinction between the data of the object and the meta-information related
to hypermedia.

But most of the time, it could be useful to treat your Siren document as
a plain JavaScript object. This way, most part of your application does not
have to rely on JSON Siren.

Sirencall allows you to unwrap data from a Siren document like you would 
have removed the envelop (but all the meta-information will still be available).

Use the function $iren.unwrap() to get access of the object without all
the metadata. Then you will get the properties part of the Siren document.
This is usually the data you want to access in your application.

```javascript

const o = $iren.unwrap(entity);

console.log(o.name);  // will print "Sirencall"
console.log(o.author); // will print "David Gayerie"

```

But the meta-information are still available by calling the function $iren. 
For instance, you can still access the title of the original Siren document.

```javascript

const o = $iren.unwrap(entity);

console.log($iren(o).title);  // will print "Siren example"

```

## Sirencall documentation

title (readonly)
: Get the title

```javascript

$iren(o).title

```

### Class

