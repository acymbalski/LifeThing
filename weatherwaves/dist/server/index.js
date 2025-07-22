
// ESM shims for Node.js built-in modules
import { createRequire as DeskThingCreateRequire } from 'module';
import { fileURLToPath as DeskThingFileURLToPath } from 'url';
import { dirname as DeskThingDirname } from 'node:path';

const require = DeskThingCreateRequire(import.meta.url);
const __filename = DeskThingFileURLToPath(import.meta.url);
const __dirname = DeskThingDirname(__filename);

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/flatbuffers/js/constants.js
var require_constants = __commonJS({
  "node_modules/flatbuffers/js/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SIZE_PREFIX_LENGTH = exports.FILE_IDENTIFIER_LENGTH = exports.SIZEOF_INT = exports.SIZEOF_SHORT = void 0;
    exports.SIZEOF_SHORT = 2;
    exports.SIZEOF_INT = 4;
    exports.FILE_IDENTIFIER_LENGTH = 4;
    exports.SIZE_PREFIX_LENGTH = 4;
  }
});

// node_modules/flatbuffers/js/utils.js
var require_utils = __commonJS({
  "node_modules/flatbuffers/js/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isLittleEndian = exports.float64 = exports.float32 = exports.int32 = void 0;
    exports.int32 = new Int32Array(2);
    exports.float32 = new Float32Array(exports.int32.buffer);
    exports.float64 = new Float64Array(exports.int32.buffer);
    exports.isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
  }
});

// node_modules/flatbuffers/js/encoding.js
var require_encoding = __commonJS({
  "node_modules/flatbuffers/js/encoding.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Encoding = void 0;
    var Encoding;
    (function(Encoding2) {
      Encoding2[Encoding2["UTF8_BYTES"] = 1] = "UTF8_BYTES";
      Encoding2[Encoding2["UTF16_STRING"] = 2] = "UTF16_STRING";
    })(Encoding || (exports.Encoding = Encoding = {}));
  }
});

// node_modules/flatbuffers/js/byte-buffer.js
var require_byte_buffer = __commonJS({
  "node_modules/flatbuffers/js/byte-buffer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ByteBuffer = void 0;
    var constants_js_1 = require_constants();
    var utils_js_1 = require_utils();
    var encoding_js_1 = require_encoding();
    var ByteBuffer = class _ByteBuffer {
      /**
       * Create a new ByteBuffer with a given array of bytes (`Uint8Array`)
       */
      constructor(bytes_) {
        this.bytes_ = bytes_;
        this.position_ = 0;
        this.text_decoder_ = new TextDecoder();
      }
      /**
       * Create and allocate a new ByteBuffer with a given size.
       */
      static allocate(byte_size) {
        return new _ByteBuffer(new Uint8Array(byte_size));
      }
      clear() {
        this.position_ = 0;
      }
      /**
       * Get the underlying `Uint8Array`.
       */
      bytes() {
        return this.bytes_;
      }
      /**
       * Get the buffer's position.
       */
      position() {
        return this.position_;
      }
      /**
       * Set the buffer's position.
       */
      setPosition(position) {
        this.position_ = position;
      }
      /**
       * Get the buffer's capacity.
       */
      capacity() {
        return this.bytes_.length;
      }
      readInt8(offset) {
        return this.readUint8(offset) << 24 >> 24;
      }
      readUint8(offset) {
        return this.bytes_[offset];
      }
      readInt16(offset) {
        return this.readUint16(offset) << 16 >> 16;
      }
      readUint16(offset) {
        return this.bytes_[offset] | this.bytes_[offset + 1] << 8;
      }
      readInt32(offset) {
        return this.bytes_[offset] | this.bytes_[offset + 1] << 8 | this.bytes_[offset + 2] << 16 | this.bytes_[offset + 3] << 24;
      }
      readUint32(offset) {
        return this.readInt32(offset) >>> 0;
      }
      readInt64(offset) {
        return BigInt.asIntN(64, BigInt(this.readUint32(offset)) + (BigInt(this.readUint32(offset + 4)) << BigInt(32)));
      }
      readUint64(offset) {
        return BigInt.asUintN(64, BigInt(this.readUint32(offset)) + (BigInt(this.readUint32(offset + 4)) << BigInt(32)));
      }
      readFloat32(offset) {
        utils_js_1.int32[0] = this.readInt32(offset);
        return utils_js_1.float32[0];
      }
      readFloat64(offset) {
        utils_js_1.int32[utils_js_1.isLittleEndian ? 0 : 1] = this.readInt32(offset);
        utils_js_1.int32[utils_js_1.isLittleEndian ? 1 : 0] = this.readInt32(offset + 4);
        return utils_js_1.float64[0];
      }
      writeInt8(offset, value) {
        this.bytes_[offset] = value;
      }
      writeUint8(offset, value) {
        this.bytes_[offset] = value;
      }
      writeInt16(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
      }
      writeUint16(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
      }
      writeInt32(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
        this.bytes_[offset + 2] = value >> 16;
        this.bytes_[offset + 3] = value >> 24;
      }
      writeUint32(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
        this.bytes_[offset + 2] = value >> 16;
        this.bytes_[offset + 3] = value >> 24;
      }
      writeInt64(offset, value) {
        this.writeInt32(offset, Number(BigInt.asIntN(32, value)));
        this.writeInt32(offset + 4, Number(BigInt.asIntN(32, value >> BigInt(32))));
      }
      writeUint64(offset, value) {
        this.writeUint32(offset, Number(BigInt.asUintN(32, value)));
        this.writeUint32(offset + 4, Number(BigInt.asUintN(32, value >> BigInt(32))));
      }
      writeFloat32(offset, value) {
        utils_js_1.float32[0] = value;
        this.writeInt32(offset, utils_js_1.int32[0]);
      }
      writeFloat64(offset, value) {
        utils_js_1.float64[0] = value;
        this.writeInt32(offset, utils_js_1.int32[utils_js_1.isLittleEndian ? 0 : 1]);
        this.writeInt32(offset + 4, utils_js_1.int32[utils_js_1.isLittleEndian ? 1 : 0]);
      }
      /**
       * Return the file identifier.   Behavior is undefined for FlatBuffers whose
       * schema does not include a file_identifier (likely points at padding or the
       * start of a the root vtable).
       */
      getBufferIdentifier() {
        if (this.bytes_.length < this.position_ + constants_js_1.SIZEOF_INT + constants_js_1.FILE_IDENTIFIER_LENGTH) {
          throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");
        }
        let result = "";
        for (let i = 0; i < constants_js_1.FILE_IDENTIFIER_LENGTH; i++) {
          result += String.fromCharCode(this.readInt8(this.position_ + constants_js_1.SIZEOF_INT + i));
        }
        return result;
      }
      /**
       * Look up a field in the vtable, return an offset into the object, or 0 if the
       * field is not present.
       */
      __offset(bb_pos, vtable_offset) {
        const vtable = bb_pos - this.readInt32(bb_pos);
        return vtable_offset < this.readInt16(vtable) ? this.readInt16(vtable + vtable_offset) : 0;
      }
      /**
       * Initialize any Table-derived type to point to the union at the given offset.
       */
      __union(t, offset) {
        t.bb_pos = offset + this.readInt32(offset);
        t.bb = this;
        return t;
      }
      /**
       * Create a JavaScript string from UTF-8 data stored inside the FlatBuffer.
       * This allocates a new string and converts to wide chars upon each access.
       *
       * To avoid the conversion to string, pass Encoding.UTF8_BYTES as the
       * "optionalEncoding" argument. This is useful for avoiding conversion when
       * the data will just be packaged back up in another FlatBuffer later on.
       *
       * @param offset
       * @param opt_encoding Defaults to UTF16_STRING
       */
      __string(offset, opt_encoding) {
        offset += this.readInt32(offset);
        const length = this.readInt32(offset);
        offset += constants_js_1.SIZEOF_INT;
        const utf8bytes = this.bytes_.subarray(offset, offset + length);
        if (opt_encoding === encoding_js_1.Encoding.UTF8_BYTES)
          return utf8bytes;
        else
          return this.text_decoder_.decode(utf8bytes);
      }
      /**
       * Handle unions that can contain string as its member, if a Table-derived type then initialize it,
       * if a string then return a new one
       *
       * WARNING: strings are immutable in JS so we can't change the string that the user gave us, this
       * makes the behaviour of __union_with_string different compared to __union
       */
      __union_with_string(o, offset) {
        if (typeof o === "string") {
          return this.__string(offset);
        }
        return this.__union(o, offset);
      }
      /**
       * Retrieve the relative offset stored at "offset"
       */
      __indirect(offset) {
        return offset + this.readInt32(offset);
      }
      /**
       * Get the start of data of a vector whose offset is stored at "offset" in this object.
       */
      __vector(offset) {
        return offset + this.readInt32(offset) + constants_js_1.SIZEOF_INT;
      }
      /**
       * Get the length of a vector whose offset is stored at "offset" in this object.
       */
      __vector_len(offset) {
        return this.readInt32(offset + this.readInt32(offset));
      }
      __has_identifier(ident) {
        if (ident.length != constants_js_1.FILE_IDENTIFIER_LENGTH) {
          throw new Error("FlatBuffers: file identifier must be length " + constants_js_1.FILE_IDENTIFIER_LENGTH);
        }
        for (let i = 0; i < constants_js_1.FILE_IDENTIFIER_LENGTH; i++) {
          if (ident.charCodeAt(i) != this.readInt8(this.position() + constants_js_1.SIZEOF_INT + i)) {
            return false;
          }
        }
        return true;
      }
      /**
       * A helper function for generating list for obj api
       */
      createScalarList(listAccessor, listLength) {
        const ret = [];
        for (let i = 0; i < listLength; ++i) {
          const val = listAccessor(i);
          if (val !== null) {
            ret.push(val);
          }
        }
        return ret;
      }
      /**
       * A helper function for generating list for obj api
       * @param listAccessor function that accepts an index and return data at that index
       * @param listLength listLength
       * @param res result list
       */
      createObjList(listAccessor, listLength) {
        const ret = [];
        for (let i = 0; i < listLength; ++i) {
          const val = listAccessor(i);
          if (val !== null) {
            ret.push(val.unpack());
          }
        }
        return ret;
      }
    };
    exports.ByteBuffer = ByteBuffer;
  }
});

// node_modules/flatbuffers/js/builder.js
var require_builder = __commonJS({
  "node_modules/flatbuffers/js/builder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Builder = void 0;
    var byte_buffer_js_1 = require_byte_buffer();
    var constants_js_1 = require_constants();
    var Builder = class _Builder {
      /**
       * Create a FlatBufferBuilder.
       */
      constructor(opt_initial_size) {
        this.minalign = 1;
        this.vtable = null;
        this.vtable_in_use = 0;
        this.isNested = false;
        this.object_start = 0;
        this.vtables = [];
        this.vector_num_elems = 0;
        this.force_defaults = false;
        this.string_maps = null;
        this.text_encoder = new TextEncoder();
        let initial_size;
        if (!opt_initial_size) {
          initial_size = 1024;
        } else {
          initial_size = opt_initial_size;
        }
        this.bb = byte_buffer_js_1.ByteBuffer.allocate(initial_size);
        this.space = initial_size;
      }
      clear() {
        this.bb.clear();
        this.space = this.bb.capacity();
        this.minalign = 1;
        this.vtable = null;
        this.vtable_in_use = 0;
        this.isNested = false;
        this.object_start = 0;
        this.vtables = [];
        this.vector_num_elems = 0;
        this.force_defaults = false;
        this.string_maps = null;
      }
      /**
       * In order to save space, fields that are set to their default value
       * don't get serialized into the buffer. Forcing defaults provides a
       * way to manually disable this optimization.
       *
       * @param forceDefaults true always serializes default values
       */
      forceDefaults(forceDefaults) {
        this.force_defaults = forceDefaults;
      }
      /**
       * Get the ByteBuffer representing the FlatBuffer. Only call this after you've
       * called finish(). The actual data starts at the ByteBuffer's current position,
       * not necessarily at 0.
       */
      dataBuffer() {
        return this.bb;
      }
      /**
       * Get the bytes representing the FlatBuffer. Only call this after you've
       * called finish().
       */
      asUint8Array() {
        return this.bb.bytes().subarray(this.bb.position(), this.bb.position() + this.offset());
      }
      /**
       * Prepare to write an element of `size` after `additional_bytes` have been
       * written, e.g. if you write a string, you need to align such the int length
       * field is aligned to 4 bytes, and the string data follows it directly. If all
       * you need to do is alignment, `additional_bytes` will be 0.
       *
       * @param size This is the of the new element to write
       * @param additional_bytes The padding size
       */
      prep(size, additional_bytes) {
        if (size > this.minalign) {
          this.minalign = size;
        }
        const align_size = ~(this.bb.capacity() - this.space + additional_bytes) + 1 & size - 1;
        while (this.space < align_size + size + additional_bytes) {
          const old_buf_size = this.bb.capacity();
          this.bb = _Builder.growByteBuffer(this.bb);
          this.space += this.bb.capacity() - old_buf_size;
        }
        this.pad(align_size);
      }
      pad(byte_size) {
        for (let i = 0; i < byte_size; i++) {
          this.bb.writeInt8(--this.space, 0);
        }
      }
      writeInt8(value) {
        this.bb.writeInt8(this.space -= 1, value);
      }
      writeInt16(value) {
        this.bb.writeInt16(this.space -= 2, value);
      }
      writeInt32(value) {
        this.bb.writeInt32(this.space -= 4, value);
      }
      writeInt64(value) {
        this.bb.writeInt64(this.space -= 8, value);
      }
      writeFloat32(value) {
        this.bb.writeFloat32(this.space -= 4, value);
      }
      writeFloat64(value) {
        this.bb.writeFloat64(this.space -= 8, value);
      }
      /**
       * Add an `int8` to the buffer, properly aligned, and grows the buffer (if necessary).
       * @param value The `int8` to add the buffer.
       */
      addInt8(value) {
        this.prep(1, 0);
        this.writeInt8(value);
      }
      /**
       * Add an `int16` to the buffer, properly aligned, and grows the buffer (if necessary).
       * @param value The `int16` to add the buffer.
       */
      addInt16(value) {
        this.prep(2, 0);
        this.writeInt16(value);
      }
      /**
       * Add an `int32` to the buffer, properly aligned, and grows the buffer (if necessary).
       * @param value The `int32` to add the buffer.
       */
      addInt32(value) {
        this.prep(4, 0);
        this.writeInt32(value);
      }
      /**
       * Add an `int64` to the buffer, properly aligned, and grows the buffer (if necessary).
       * @param value The `int64` to add the buffer.
       */
      addInt64(value) {
        this.prep(8, 0);
        this.writeInt64(value);
      }
      /**
       * Add a `float32` to the buffer, properly aligned, and grows the buffer (if necessary).
       * @param value The `float32` to add the buffer.
       */
      addFloat32(value) {
        this.prep(4, 0);
        this.writeFloat32(value);
      }
      /**
       * Add a `float64` to the buffer, properly aligned, and grows the buffer (if necessary).
       * @param value The `float64` to add the buffer.
       */
      addFloat64(value) {
        this.prep(8, 0);
        this.writeFloat64(value);
      }
      addFieldInt8(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
          this.addInt8(value);
          this.slot(voffset);
        }
      }
      addFieldInt16(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
          this.addInt16(value);
          this.slot(voffset);
        }
      }
      addFieldInt32(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
          this.addInt32(value);
          this.slot(voffset);
        }
      }
      addFieldInt64(voffset, value, defaultValue) {
        if (this.force_defaults || value !== defaultValue) {
          this.addInt64(value);
          this.slot(voffset);
        }
      }
      addFieldFloat32(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
          this.addFloat32(value);
          this.slot(voffset);
        }
      }
      addFieldFloat64(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
          this.addFloat64(value);
          this.slot(voffset);
        }
      }
      addFieldOffset(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
          this.addOffset(value);
          this.slot(voffset);
        }
      }
      /**
       * Structs are stored inline, so nothing additional is being added. `d` is always 0.
       */
      addFieldStruct(voffset, value, defaultValue) {
        if (value != defaultValue) {
          this.nested(value);
          this.slot(voffset);
        }
      }
      /**
       * Structures are always stored inline, they need to be created right
       * where they're used.  You'll get this assertion failure if you
       * created it elsewhere.
       */
      nested(obj) {
        if (obj != this.offset()) {
          throw new TypeError("FlatBuffers: struct must be serialized inline.");
        }
      }
      /**
       * Should not be creating any other object, string or vector
       * while an object is being constructed
       */
      notNested() {
        if (this.isNested) {
          throw new TypeError("FlatBuffers: object serialization must not be nested.");
        }
      }
      /**
       * Set the current vtable at `voffset` to the current location in the buffer.
       */
      slot(voffset) {
        if (this.vtable !== null)
          this.vtable[voffset] = this.offset();
      }
      /**
       * @returns Offset relative to the end of the buffer.
       */
      offset() {
        return this.bb.capacity() - this.space;
      }
      /**
       * Doubles the size of the backing ByteBuffer and copies the old data towards
       * the end of the new buffer (since we build the buffer backwards).
       *
       * @param bb The current buffer with the existing data
       * @returns A new byte buffer with the old data copied
       * to it. The data is located at the end of the buffer.
       *
       * uint8Array.set() formally takes {Array<number>|ArrayBufferView}, so to pass
       * it a uint8Array we need to suppress the type check:
       * @suppress {checkTypes}
       */
      static growByteBuffer(bb) {
        const old_buf_size = bb.capacity();
        if (old_buf_size & 3221225472) {
          throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");
        }
        const new_buf_size = old_buf_size << 1;
        const nbb = byte_buffer_js_1.ByteBuffer.allocate(new_buf_size);
        nbb.setPosition(new_buf_size - old_buf_size);
        nbb.bytes().set(bb.bytes(), new_buf_size - old_buf_size);
        return nbb;
      }
      /**
       * Adds on offset, relative to where it will be written.
       *
       * @param offset The offset to add.
       */
      addOffset(offset) {
        this.prep(constants_js_1.SIZEOF_INT, 0);
        this.writeInt32(this.offset() - offset + constants_js_1.SIZEOF_INT);
      }
      /**
       * Start encoding a new object in the buffer.  Users will not usually need to
       * call this directly. The FlatBuffers compiler will generate helper methods
       * that call this method internally.
       */
      startObject(numfields) {
        this.notNested();
        if (this.vtable == null) {
          this.vtable = [];
        }
        this.vtable_in_use = numfields;
        for (let i = 0; i < numfields; i++) {
          this.vtable[i] = 0;
        }
        this.isNested = true;
        this.object_start = this.offset();
      }
      /**
       * Finish off writing the object that is under construction.
       *
       * @returns The offset to the object inside `dataBuffer`
       */
      endObject() {
        if (this.vtable == null || !this.isNested) {
          throw new Error("FlatBuffers: endObject called without startObject");
        }
        this.addInt32(0);
        const vtableloc = this.offset();
        let i = this.vtable_in_use - 1;
        for (; i >= 0 && this.vtable[i] == 0; i--) {
        }
        const trimmed_size = i + 1;
        for (; i >= 0; i--) {
          this.addInt16(this.vtable[i] != 0 ? vtableloc - this.vtable[i] : 0);
        }
        const standard_fields = 2;
        this.addInt16(vtableloc - this.object_start);
        const len = (trimmed_size + standard_fields) * constants_js_1.SIZEOF_SHORT;
        this.addInt16(len);
        let existing_vtable = 0;
        const vt1 = this.space;
        outer_loop: for (i = 0; i < this.vtables.length; i++) {
          const vt2 = this.bb.capacity() - this.vtables[i];
          if (len == this.bb.readInt16(vt2)) {
            for (let j = constants_js_1.SIZEOF_SHORT; j < len; j += constants_js_1.SIZEOF_SHORT) {
              if (this.bb.readInt16(vt1 + j) != this.bb.readInt16(vt2 + j)) {
                continue outer_loop;
              }
            }
            existing_vtable = this.vtables[i];
            break;
          }
        }
        if (existing_vtable) {
          this.space = this.bb.capacity() - vtableloc;
          this.bb.writeInt32(this.space, existing_vtable - vtableloc);
        } else {
          this.vtables.push(this.offset());
          this.bb.writeInt32(this.bb.capacity() - vtableloc, this.offset() - vtableloc);
        }
        this.isNested = false;
        return vtableloc;
      }
      /**
       * Finalize a buffer, poiting to the given `root_table`.
       */
      finish(root_table, opt_file_identifier, opt_size_prefix) {
        const size_prefix = opt_size_prefix ? constants_js_1.SIZE_PREFIX_LENGTH : 0;
        if (opt_file_identifier) {
          const file_identifier = opt_file_identifier;
          this.prep(this.minalign, constants_js_1.SIZEOF_INT + constants_js_1.FILE_IDENTIFIER_LENGTH + size_prefix);
          if (file_identifier.length != constants_js_1.FILE_IDENTIFIER_LENGTH) {
            throw new TypeError("FlatBuffers: file identifier must be length " + constants_js_1.FILE_IDENTIFIER_LENGTH);
          }
          for (let i = constants_js_1.FILE_IDENTIFIER_LENGTH - 1; i >= 0; i--) {
            this.writeInt8(file_identifier.charCodeAt(i));
          }
        }
        this.prep(this.minalign, constants_js_1.SIZEOF_INT + size_prefix);
        this.addOffset(root_table);
        if (size_prefix) {
          this.addInt32(this.bb.capacity() - this.space);
        }
        this.bb.setPosition(this.space);
      }
      /**
       * Finalize a size prefixed buffer, pointing to the given `root_table`.
       */
      finishSizePrefixed(root_table, opt_file_identifier) {
        this.finish(root_table, opt_file_identifier, true);
      }
      /**
       * This checks a required field has been set in a given table that has
       * just been constructed.
       */
      requiredField(table, field) {
        const table_start = this.bb.capacity() - table;
        const vtable_start = table_start - this.bb.readInt32(table_start);
        const ok = field < this.bb.readInt16(vtable_start) && this.bb.readInt16(vtable_start + field) != 0;
        if (!ok) {
          throw new TypeError("FlatBuffers: field " + field + " must be set");
        }
      }
      /**
       * Start a new array/vector of objects.  Users usually will not call
       * this directly. The FlatBuffers compiler will create a start/end
       * method for vector types in generated code.
       *
       * @param elem_size The size of each element in the array
       * @param num_elems The number of elements in the array
       * @param alignment The alignment of the array
       */
      startVector(elem_size, num_elems, alignment) {
        this.notNested();
        this.vector_num_elems = num_elems;
        this.prep(constants_js_1.SIZEOF_INT, elem_size * num_elems);
        this.prep(alignment, elem_size * num_elems);
      }
      /**
       * Finish off the creation of an array and all its elements. The array must be
       * created with `startVector`.
       *
       * @returns The offset at which the newly created array
       * starts.
       */
      endVector() {
        this.writeInt32(this.vector_num_elems);
        return this.offset();
      }
      /**
       * Encode the string `s` in the buffer using UTF-8. If the string passed has
       * already been seen, we return the offset of the already written string
       *
       * @param s The string to encode
       * @return The offset in the buffer where the encoded string starts
       */
      createSharedString(s) {
        if (!s) {
          return 0;
        }
        if (!this.string_maps) {
          this.string_maps = /* @__PURE__ */ new Map();
        }
        if (this.string_maps.has(s)) {
          return this.string_maps.get(s);
        }
        const offset = this.createString(s);
        this.string_maps.set(s, offset);
        return offset;
      }
      /**
       * Encode the string `s` in the buffer using UTF-8. If a Uint8Array is passed
       * instead of a string, it is assumed to contain valid UTF-8 encoded data.
       *
       * @param s The string to encode
       * @return The offset in the buffer where the encoded string starts
       */
      createString(s) {
        if (s === null || s === void 0) {
          return 0;
        }
        let utf8;
        if (s instanceof Uint8Array) {
          utf8 = s;
        } else {
          utf8 = this.text_encoder.encode(s);
        }
        this.addInt8(0);
        this.startVector(1, utf8.length, 1);
        this.bb.setPosition(this.space -= utf8.length);
        this.bb.bytes().set(utf8, this.space);
        return this.endVector();
      }
      /**
       * Create a byte vector.
       *
       * @param v The bytes to add
       * @returns The offset in the buffer where the byte vector starts
       */
      createByteVector(v) {
        if (v === null || v === void 0) {
          return 0;
        }
        this.startVector(1, v.length, 1);
        this.bb.setPosition(this.space -= v.length);
        this.bb.bytes().set(v, this.space);
        return this.endVector();
      }
      /**
       * A helper function to pack an object
       *
       * @returns offset of obj
       */
      createObjectOffset(obj) {
        if (obj === null) {
          return 0;
        }
        if (typeof obj === "string") {
          return this.createString(obj);
        } else {
          return obj.pack(this);
        }
      }
      /**
       * A helper function to pack a list of object
       *
       * @returns list of offsets of each non null object
       */
      createObjectOffsetList(list) {
        const ret = [];
        for (let i = 0; i < list.length; ++i) {
          const val = list[i];
          if (val !== null) {
            ret.push(this.createObjectOffset(val));
          } else {
            throw new TypeError("FlatBuffers: Argument for createObjectOffsetList cannot contain null.");
          }
        }
        return ret;
      }
      createStructOffsetList(list, startFunc) {
        startFunc(this, list.length);
        this.createObjectOffsetList(list.slice().reverse());
        return this.endVector();
      }
    };
    exports.Builder = Builder;
  }
});

// node_modules/flatbuffers/js/flatbuffers.js
var require_flatbuffers = __commonJS({
  "node_modules/flatbuffers/js/flatbuffers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ByteBuffer = exports.Builder = exports.Encoding = exports.isLittleEndian = exports.float64 = exports.float32 = exports.int32 = exports.SIZE_PREFIX_LENGTH = exports.FILE_IDENTIFIER_LENGTH = exports.SIZEOF_INT = exports.SIZEOF_SHORT = void 0;
    var constants_js_1 = require_constants();
    Object.defineProperty(exports, "SIZEOF_SHORT", { enumerable: true, get: function() {
      return constants_js_1.SIZEOF_SHORT;
    } });
    var constants_js_2 = require_constants();
    Object.defineProperty(exports, "SIZEOF_INT", { enumerable: true, get: function() {
      return constants_js_2.SIZEOF_INT;
    } });
    var constants_js_3 = require_constants();
    Object.defineProperty(exports, "FILE_IDENTIFIER_LENGTH", { enumerable: true, get: function() {
      return constants_js_3.FILE_IDENTIFIER_LENGTH;
    } });
    var constants_js_4 = require_constants();
    Object.defineProperty(exports, "SIZE_PREFIX_LENGTH", { enumerable: true, get: function() {
      return constants_js_4.SIZE_PREFIX_LENGTH;
    } });
    var utils_js_1 = require_utils();
    Object.defineProperty(exports, "int32", { enumerable: true, get: function() {
      return utils_js_1.int32;
    } });
    Object.defineProperty(exports, "float32", { enumerable: true, get: function() {
      return utils_js_1.float32;
    } });
    Object.defineProperty(exports, "float64", { enumerable: true, get: function() {
      return utils_js_1.float64;
    } });
    Object.defineProperty(exports, "isLittleEndian", { enumerable: true, get: function() {
      return utils_js_1.isLittleEndian;
    } });
    var encoding_js_1 = require_encoding();
    Object.defineProperty(exports, "Encoding", { enumerable: true, get: function() {
      return encoding_js_1.Encoding;
    } });
    var builder_js_1 = require_builder();
    Object.defineProperty(exports, "Builder", { enumerable: true, get: function() {
      return builder_js_1.Builder;
    } });
    var byte_buffer_js_1 = require_byte_buffer();
    Object.defineProperty(exports, "ByteBuffer", { enumerable: true, get: function() {
      return byte_buffer_js_1.ByteBuffer;
    } });
  }
});

// node_modules/@openmeteo/sdk/model.js
var require_model = __commonJS({
  "node_modules/@openmeteo/sdk/model.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    var Model;
    (function(Model2) {
      Model2[Model2["undefined"] = 0] = "undefined";
      Model2[Model2["best_match"] = 1] = "best_match";
      Model2[Model2["gfs_seamless"] = 2] = "gfs_seamless";
      Model2[Model2["gfs_global"] = 3] = "gfs_global";
      Model2[Model2["gfs_hrrr"] = 4] = "gfs_hrrr";
      Model2[Model2["meteofrance_seamless"] = 5] = "meteofrance_seamless";
      Model2[Model2["meteofrance_arpege_seamless"] = 6] = "meteofrance_arpege_seamless";
      Model2[Model2["meteofrance_arpege_world"] = 7] = "meteofrance_arpege_world";
      Model2[Model2["meteofrance_arpege_europe"] = 8] = "meteofrance_arpege_europe";
      Model2[Model2["meteofrance_arome_seamless"] = 9] = "meteofrance_arome_seamless";
      Model2[Model2["meteofrance_arome_france"] = 10] = "meteofrance_arome_france";
      Model2[Model2["meteofrance_arome_france_hd"] = 11] = "meteofrance_arome_france_hd";
      Model2[Model2["jma_seamless"] = 12] = "jma_seamless";
      Model2[Model2["jma_msm"] = 13] = "jma_msm";
      Model2[Model2["jms_gsm"] = 14] = "jms_gsm";
      Model2[Model2["jma_gsm"] = 15] = "jma_gsm";
      Model2[Model2["gem_seamless"] = 16] = "gem_seamless";
      Model2[Model2["gem_global"] = 17] = "gem_global";
      Model2[Model2["gem_regional"] = 18] = "gem_regional";
      Model2[Model2["gem_hrdps_continental"] = 19] = "gem_hrdps_continental";
      Model2[Model2["icon_seamless"] = 20] = "icon_seamless";
      Model2[Model2["icon_global"] = 21] = "icon_global";
      Model2[Model2["icon_eu"] = 22] = "icon_eu";
      Model2[Model2["icon_d2"] = 23] = "icon_d2";
      Model2[Model2["ecmwf_ifs04"] = 24] = "ecmwf_ifs04";
      Model2[Model2["metno_nordic"] = 25] = "metno_nordic";
      Model2[Model2["era5_seamless"] = 26] = "era5_seamless";
      Model2[Model2["era5"] = 27] = "era5";
      Model2[Model2["cerra"] = 28] = "cerra";
      Model2[Model2["era5_land"] = 29] = "era5_land";
      Model2[Model2["ecmwf_ifs"] = 30] = "ecmwf_ifs";
      Model2[Model2["gwam"] = 31] = "gwam";
      Model2[Model2["ewam"] = 32] = "ewam";
      Model2[Model2["glofas_seamless_v3"] = 33] = "glofas_seamless_v3";
      Model2[Model2["glofas_forecast_v3"] = 34] = "glofas_forecast_v3";
      Model2[Model2["glofas_consolidated_v3"] = 35] = "glofas_consolidated_v3";
      Model2[Model2["glofas_seamless_v4"] = 36] = "glofas_seamless_v4";
      Model2[Model2["glofas_forecast_v4"] = 37] = "glofas_forecast_v4";
      Model2[Model2["glofas_consolidated_v4"] = 38] = "glofas_consolidated_v4";
      Model2[Model2["gfs025"] = 39] = "gfs025";
      Model2[Model2["gfs05"] = 40] = "gfs05";
      Model2[Model2["CMCC_CM2_VHR4"] = 41] = "CMCC_CM2_VHR4";
      Model2[Model2["FGOALS_f3_H_highresSST"] = 42] = "FGOALS_f3_H_highresSST";
      Model2[Model2["FGOALS_f3_H"] = 43] = "FGOALS_f3_H";
      Model2[Model2["HiRAM_SIT_HR"] = 44] = "HiRAM_SIT_HR";
      Model2[Model2["MRI_AGCM3_2_S"] = 45] = "MRI_AGCM3_2_S";
      Model2[Model2["EC_Earth3P_HR"] = 46] = "EC_Earth3P_HR";
      Model2[Model2["MPI_ESM1_2_XR"] = 47] = "MPI_ESM1_2_XR";
      Model2[Model2["NICAM16_8S"] = 48] = "NICAM16_8S";
      Model2[Model2["cams_europe"] = 49] = "cams_europe";
      Model2[Model2["cams_global"] = 50] = "cams_global";
      Model2[Model2["cfsv2"] = 51] = "cfsv2";
      Model2[Model2["era5_ocean"] = 52] = "era5_ocean";
      Model2[Model2["cma_grapes_global"] = 53] = "cma_grapes_global";
      Model2[Model2["bom_access_global"] = 54] = "bom_access_global";
      Model2[Model2["bom_access_global_ensemble"] = 55] = "bom_access_global_ensemble";
      Model2[Model2["arpae_cosmo_seamless"] = 56] = "arpae_cosmo_seamless";
      Model2[Model2["arpae_cosmo_2i"] = 57] = "arpae_cosmo_2i";
      Model2[Model2["arpae_cosmo_2i_ruc"] = 58] = "arpae_cosmo_2i_ruc";
      Model2[Model2["arpae_cosmo_5m"] = 59] = "arpae_cosmo_5m";
      Model2[Model2["ecmwf_ifs025"] = 60] = "ecmwf_ifs025";
      Model2[Model2["ecmwf_aifs025"] = 61] = "ecmwf_aifs025";
      Model2[Model2["gfs013"] = 62] = "gfs013";
      Model2[Model2["gfs_graphcast025"] = 63] = "gfs_graphcast025";
      Model2[Model2["ecmwf_wam025"] = 64] = "ecmwf_wam025";
      Model2[Model2["meteofrance_wave"] = 65] = "meteofrance_wave";
      Model2[Model2["meteofrance_currents"] = 66] = "meteofrance_currents";
      Model2[Model2["ecmwf_wam025_ensemble"] = 67] = "ecmwf_wam025_ensemble";
      Model2[Model2["ncep_gfswave025"] = 68] = "ncep_gfswave025";
      Model2[Model2["ncep_gefswave025"] = 69] = "ncep_gefswave025";
      Model2[Model2["knmi_seamless"] = 70] = "knmi_seamless";
      Model2[Model2["knmi_harmonie_arome_europe"] = 71] = "knmi_harmonie_arome_europe";
      Model2[Model2["knmi_harmonie_arome_netherlands"] = 72] = "knmi_harmonie_arome_netherlands";
      Model2[Model2["dmi_seamless"] = 73] = "dmi_seamless";
      Model2[Model2["dmi_harmonie_arome_europe"] = 74] = "dmi_harmonie_arome_europe";
      Model2[Model2["metno_seamless"] = 75] = "metno_seamless";
      Model2[Model2["era5_ensemble"] = 76] = "era5_ensemble";
      Model2[Model2["ecmwf_ifs_analysis"] = 77] = "ecmwf_ifs_analysis";
      Model2[Model2["ecmwf_ifs_long_window"] = 78] = "ecmwf_ifs_long_window";
      Model2[Model2["ecmwf_ifs_analysis_long_window"] = 79] = "ecmwf_ifs_analysis_long_window";
      Model2[Model2["ukmo_global_deterministic_10km"] = 80] = "ukmo_global_deterministic_10km";
      Model2[Model2["ukmo_uk_deterministic_2km"] = 81] = "ukmo_uk_deterministic_2km";
      Model2[Model2["ukmo_seamless"] = 82] = "ukmo_seamless";
      Model2[Model2["ncep_gfswave016"] = 83] = "ncep_gfswave016";
      Model2[Model2["ncep_nbm_conus"] = 84] = "ncep_nbm_conus";
    })(Model || (exports.Model = Model = {}));
  }
});

// node_modules/@openmeteo/sdk/aggregation.js
var require_aggregation = __commonJS({
  "node_modules/@openmeteo/sdk/aggregation.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Aggregation = void 0;
    var Aggregation;
    (function(Aggregation2) {
      Aggregation2[Aggregation2["none"] = 0] = "none";
      Aggregation2[Aggregation2["minimum"] = 1] = "minimum";
      Aggregation2[Aggregation2["maximum"] = 2] = "maximum";
      Aggregation2[Aggregation2["mean"] = 3] = "mean";
      Aggregation2[Aggregation2["p10"] = 4] = "p10";
      Aggregation2[Aggregation2["p25"] = 5] = "p25";
      Aggregation2[Aggregation2["median"] = 6] = "median";
      Aggregation2[Aggregation2["p75"] = 7] = "p75";
      Aggregation2[Aggregation2["p90"] = 8] = "p90";
      Aggregation2[Aggregation2["dominant"] = 9] = "dominant";
      Aggregation2[Aggregation2["sum"] = 10] = "sum";
      Aggregation2[Aggregation2["spread"] = 11] = "spread";
    })(Aggregation || (exports.Aggregation = Aggregation = {}));
  }
});

// node_modules/@openmeteo/sdk/unit.js
var require_unit = __commonJS({
  "node_modules/@openmeteo/sdk/unit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Unit = void 0;
    var Unit;
    (function(Unit2) {
      Unit2[Unit2["undefined"] = 0] = "undefined";
      Unit2[Unit2["celsius"] = 1] = "celsius";
      Unit2[Unit2["centimetre"] = 2] = "centimetre";
      Unit2[Unit2["cubic_metre_per_cubic_metre"] = 3] = "cubic_metre_per_cubic_metre";
      Unit2[Unit2["cubic_metre_per_second"] = 4] = "cubic_metre_per_second";
      Unit2[Unit2["degree_direction"] = 5] = "degree_direction";
      Unit2[Unit2["dimensionless_integer"] = 6] = "dimensionless_integer";
      Unit2[Unit2["dimensionless"] = 7] = "dimensionless";
      Unit2[Unit2["european_air_quality_index"] = 8] = "european_air_quality_index";
      Unit2[Unit2["fahrenheit"] = 9] = "fahrenheit";
      Unit2[Unit2["feet"] = 10] = "feet";
      Unit2[Unit2["fraction"] = 11] = "fraction";
      Unit2[Unit2["gdd_celsius"] = 12] = "gdd_celsius";
      Unit2[Unit2["geopotential_metre"] = 13] = "geopotential_metre";
      Unit2[Unit2["grains_per_cubic_metre"] = 14] = "grains_per_cubic_metre";
      Unit2[Unit2["gram_per_kilogram"] = 15] = "gram_per_kilogram";
      Unit2[Unit2["hectopascal"] = 16] = "hectopascal";
      Unit2[Unit2["hours"] = 17] = "hours";
      Unit2[Unit2["inch"] = 18] = "inch";
      Unit2[Unit2["iso8601"] = 19] = "iso8601";
      Unit2[Unit2["joule_per_kilogram"] = 20] = "joule_per_kilogram";
      Unit2[Unit2["kelvin"] = 21] = "kelvin";
      Unit2[Unit2["kilopascal"] = 22] = "kilopascal";
      Unit2[Unit2["kilogram_per_square_metre"] = 23] = "kilogram_per_square_metre";
      Unit2[Unit2["kilometres_per_hour"] = 24] = "kilometres_per_hour";
      Unit2[Unit2["knots"] = 25] = "knots";
      Unit2[Unit2["megajoule_per_square_metre"] = 26] = "megajoule_per_square_metre";
      Unit2[Unit2["metre_per_second_not_unit_converted"] = 27] = "metre_per_second_not_unit_converted";
      Unit2[Unit2["metre_per_second"] = 28] = "metre_per_second";
      Unit2[Unit2["metre"] = 29] = "metre";
      Unit2[Unit2["micrograms_per_cubic_metre"] = 30] = "micrograms_per_cubic_metre";
      Unit2[Unit2["miles_per_hour"] = 31] = "miles_per_hour";
      Unit2[Unit2["millimetre"] = 32] = "millimetre";
      Unit2[Unit2["pascal"] = 33] = "pascal";
      Unit2[Unit2["per_second"] = 34] = "per_second";
      Unit2[Unit2["percentage"] = 35] = "percentage";
      Unit2[Unit2["seconds"] = 36] = "seconds";
      Unit2[Unit2["unix_time"] = 37] = "unix_time";
      Unit2[Unit2["us_air_quality_index"] = 38] = "us_air_quality_index";
      Unit2[Unit2["watt_per_square_metre"] = 39] = "watt_per_square_metre";
      Unit2[Unit2["wmo_code"] = 40] = "wmo_code";
      Unit2[Unit2["parts_per_million"] = 41] = "parts_per_million";
    })(Unit || (exports.Unit = Unit = {}));
  }
});

// node_modules/@openmeteo/sdk/variable.js
var require_variable = __commonJS({
  "node_modules/@openmeteo/sdk/variable.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Variable = void 0;
    var Variable;
    (function(Variable2) {
      Variable2[Variable2["undefined"] = 0] = "undefined";
      Variable2[Variable2["apparent_temperature"] = 1] = "apparent_temperature";
      Variable2[Variable2["cape"] = 2] = "cape";
      Variable2[Variable2["cloud_cover"] = 3] = "cloud_cover";
      Variable2[Variable2["cloud_cover_high"] = 4] = "cloud_cover_high";
      Variable2[Variable2["cloud_cover_low"] = 5] = "cloud_cover_low";
      Variable2[Variable2["cloud_cover_mid"] = 6] = "cloud_cover_mid";
      Variable2[Variable2["daylight_duration"] = 7] = "daylight_duration";
      Variable2[Variable2["dew_point"] = 8] = "dew_point";
      Variable2[Variable2["diffuse_radiation"] = 9] = "diffuse_radiation";
      Variable2[Variable2["diffuse_radiation_instant"] = 10] = "diffuse_radiation_instant";
      Variable2[Variable2["direct_normal_irradiance"] = 11] = "direct_normal_irradiance";
      Variable2[Variable2["direct_normal_irradiance_instant"] = 12] = "direct_normal_irradiance_instant";
      Variable2[Variable2["direct_radiation"] = 13] = "direct_radiation";
      Variable2[Variable2["direct_radiation_instant"] = 14] = "direct_radiation_instant";
      Variable2[Variable2["et0_fao_evapotranspiration"] = 15] = "et0_fao_evapotranspiration";
      Variable2[Variable2["evapotranspiration"] = 16] = "evapotranspiration";
      Variable2[Variable2["freezing_level_height"] = 17] = "freezing_level_height";
      Variable2[Variable2["growing_degree_days"] = 18] = "growing_degree_days";
      Variable2[Variable2["is_day"] = 19] = "is_day";
      Variable2[Variable2["latent_heat_flux"] = 20] = "latent_heat_flux";
      Variable2[Variable2["leaf_wetness_probability"] = 21] = "leaf_wetness_probability";
      Variable2[Variable2["lifted_index"] = 22] = "lifted_index";
      Variable2[Variable2["lightning_potential"] = 23] = "lightning_potential";
      Variable2[Variable2["precipitation"] = 24] = "precipitation";
      Variable2[Variable2["precipitation_hours"] = 25] = "precipitation_hours";
      Variable2[Variable2["precipitation_probability"] = 26] = "precipitation_probability";
      Variable2[Variable2["pressure_msl"] = 27] = "pressure_msl";
      Variable2[Variable2["rain"] = 28] = "rain";
      Variable2[Variable2["relative_humidity"] = 29] = "relative_humidity";
      Variable2[Variable2["runoff"] = 30] = "runoff";
      Variable2[Variable2["sensible_heat_flux"] = 31] = "sensible_heat_flux";
      Variable2[Variable2["shortwave_radiation"] = 32] = "shortwave_radiation";
      Variable2[Variable2["shortwave_radiation_instant"] = 33] = "shortwave_radiation_instant";
      Variable2[Variable2["showers"] = 34] = "showers";
      Variable2[Variable2["snow_depth"] = 35] = "snow_depth";
      Variable2[Variable2["snow_height"] = 36] = "snow_height";
      Variable2[Variable2["snowfall"] = 37] = "snowfall";
      Variable2[Variable2["snowfall_height"] = 38] = "snowfall_height";
      Variable2[Variable2["snowfall_water_equivalent"] = 39] = "snowfall_water_equivalent";
      Variable2[Variable2["sunrise"] = 40] = "sunrise";
      Variable2[Variable2["sunset"] = 41] = "sunset";
      Variable2[Variable2["soil_moisture"] = 42] = "soil_moisture";
      Variable2[Variable2["soil_moisture_index"] = 43] = "soil_moisture_index";
      Variable2[Variable2["soil_temperature"] = 44] = "soil_temperature";
      Variable2[Variable2["surface_pressure"] = 45] = "surface_pressure";
      Variable2[Variable2["surface_temperature"] = 46] = "surface_temperature";
      Variable2[Variable2["temperature"] = 47] = "temperature";
      Variable2[Variable2["terrestrial_radiation"] = 48] = "terrestrial_radiation";
      Variable2[Variable2["terrestrial_radiation_instant"] = 49] = "terrestrial_radiation_instant";
      Variable2[Variable2["total_column_integrated_water_vapour"] = 50] = "total_column_integrated_water_vapour";
      Variable2[Variable2["updraft"] = 51] = "updraft";
      Variable2[Variable2["uv_index"] = 52] = "uv_index";
      Variable2[Variable2["uv_index_clear_sky"] = 53] = "uv_index_clear_sky";
      Variable2[Variable2["vapour_pressure_deficit"] = 54] = "vapour_pressure_deficit";
      Variable2[Variable2["visibility"] = 55] = "visibility";
      Variable2[Variable2["weather_code"] = 56] = "weather_code";
      Variable2[Variable2["wind_direction"] = 57] = "wind_direction";
      Variable2[Variable2["wind_gusts"] = 58] = "wind_gusts";
      Variable2[Variable2["wind_speed"] = 59] = "wind_speed";
      Variable2[Variable2["vertical_velocity"] = 60] = "vertical_velocity";
      Variable2[Variable2["geopotential_height"] = 61] = "geopotential_height";
      Variable2[Variable2["wet_bulb_temperature"] = 62] = "wet_bulb_temperature";
      Variable2[Variable2["river_discharge"] = 63] = "river_discharge";
      Variable2[Variable2["wave_height"] = 64] = "wave_height";
      Variable2[Variable2["wave_period"] = 65] = "wave_period";
      Variable2[Variable2["wave_direction"] = 66] = "wave_direction";
      Variable2[Variable2["wind_wave_height"] = 67] = "wind_wave_height";
      Variable2[Variable2["wind_wave_period"] = 68] = "wind_wave_period";
      Variable2[Variable2["wind_wave_peak_period"] = 69] = "wind_wave_peak_period";
      Variable2[Variable2["wind_wave_direction"] = 70] = "wind_wave_direction";
      Variable2[Variable2["swell_wave_height"] = 71] = "swell_wave_height";
      Variable2[Variable2["swell_wave_period"] = 72] = "swell_wave_period";
      Variable2[Variable2["swell_wave_peak_period"] = 73] = "swell_wave_peak_period";
      Variable2[Variable2["swell_wave_direction"] = 74] = "swell_wave_direction";
      Variable2[Variable2["pm10"] = 75] = "pm10";
      Variable2[Variable2["pm2p5"] = 76] = "pm2p5";
      Variable2[Variable2["dust"] = 77] = "dust";
      Variable2[Variable2["aerosol_optical_depth"] = 78] = "aerosol_optical_depth";
      Variable2[Variable2["carbon_monoxide"] = 79] = "carbon_monoxide";
      Variable2[Variable2["nitrogen_dioxide"] = 80] = "nitrogen_dioxide";
      Variable2[Variable2["ammonia"] = 81] = "ammonia";
      Variable2[Variable2["ozone"] = 82] = "ozone";
      Variable2[Variable2["sulphur_dioxide"] = 83] = "sulphur_dioxide";
      Variable2[Variable2["alder_pollen"] = 84] = "alder_pollen";
      Variable2[Variable2["birch_pollen"] = 85] = "birch_pollen";
      Variable2[Variable2["grass_pollen"] = 86] = "grass_pollen";
      Variable2[Variable2["mugwort_pollen"] = 87] = "mugwort_pollen";
      Variable2[Variable2["olive_pollen"] = 88] = "olive_pollen";
      Variable2[Variable2["ragweed_pollen"] = 89] = "ragweed_pollen";
      Variable2[Variable2["european_aqi"] = 90] = "european_aqi";
      Variable2[Variable2["european_aqi_pm2p5"] = 91] = "european_aqi_pm2p5";
      Variable2[Variable2["european_aqi_pm10"] = 92] = "european_aqi_pm10";
      Variable2[Variable2["european_aqi_nitrogen_dioxide"] = 93] = "european_aqi_nitrogen_dioxide";
      Variable2[Variable2["european_aqi_ozone"] = 94] = "european_aqi_ozone";
      Variable2[Variable2["european_aqi_sulphur_dioxide"] = 95] = "european_aqi_sulphur_dioxide";
      Variable2[Variable2["us_aqi"] = 96] = "us_aqi";
      Variable2[Variable2["us_aqi_pm2p5"] = 97] = "us_aqi_pm2p5";
      Variable2[Variable2["us_aqi_pm10"] = 98] = "us_aqi_pm10";
      Variable2[Variable2["us_aqi_nitrogen_dioxide"] = 99] = "us_aqi_nitrogen_dioxide";
      Variable2[Variable2["us_aqi_ozone"] = 100] = "us_aqi_ozone";
      Variable2[Variable2["us_aqi_sulphur_dioxide"] = 101] = "us_aqi_sulphur_dioxide";
      Variable2[Variable2["us_aqi_carbon_monoxide"] = 102] = "us_aqi_carbon_monoxide";
      Variable2[Variable2["sunshine_duration"] = 103] = "sunshine_duration";
      Variable2[Variable2["convective_inhibition"] = 104] = "convective_inhibition";
      Variable2[Variable2["shortwave_radiation_clear_sky"] = 105] = "shortwave_radiation_clear_sky";
      Variable2[Variable2["global_tilted_irradiance"] = 106] = "global_tilted_irradiance";
      Variable2[Variable2["global_tilted_irradiance_instant"] = 107] = "global_tilted_irradiance_instant";
      Variable2[Variable2["ocean_current_velocity"] = 108] = "ocean_current_velocity";
      Variable2[Variable2["ocean_current_direction"] = 109] = "ocean_current_direction";
      Variable2[Variable2["cloud_base"] = 110] = "cloud_base";
      Variable2[Variable2["cloud_top"] = 111] = "cloud_top";
      Variable2[Variable2["mass_density"] = 112] = "mass_density";
      Variable2[Variable2["boundary_layer_height"] = 113] = "boundary_layer_height";
      Variable2[Variable2["formaldehyde"] = 114] = "formaldehyde";
      Variable2[Variable2["glyoxal"] = 115] = "glyoxal";
      Variable2[Variable2["non_methane_volatile_organic_compounds"] = 116] = "non_methane_volatile_organic_compounds";
      Variable2[Variable2["pm10_wildfires"] = 117] = "pm10_wildfires";
      Variable2[Variable2["peroxyacyl_nitrates"] = 118] = "peroxyacyl_nitrates";
      Variable2[Variable2["secondary_inorganic_aerosol"] = 119] = "secondary_inorganic_aerosol";
      Variable2[Variable2["residential_elementary_carbon"] = 120] = "residential_elementary_carbon";
      Variable2[Variable2["total_elementary_carbon"] = 121] = "total_elementary_carbon";
      Variable2[Variable2["pm2_5_total_organic_matter"] = 122] = "pm2_5_total_organic_matter";
      Variable2[Variable2["sea_salt_aerosol"] = 123] = "sea_salt_aerosol";
      Variable2[Variable2["nitrogen_monoxide"] = 124] = "nitrogen_monoxide";
      Variable2[Variable2["thunderstorm_probability"] = 125] = "thunderstorm_probability";
      Variable2[Variable2["rain_probability"] = 126] = "rain_probability";
      Variable2[Variable2["freezing_rain_probability"] = 127] = "freezing_rain_probability";
      Variable2[Variable2["ice_pellets_probability"] = 128] = "ice_pellets_probability";
      Variable2[Variable2["snowfall_probability"] = 129] = "snowfall_probability";
      Variable2[Variable2["carbon_dioxide"] = 130] = "carbon_dioxide";
      Variable2[Variable2["methane"] = 131] = "methane";
    })(Variable || (exports.Variable = Variable = {}));
  }
});

// node_modules/@openmeteo/sdk/variable-with-values.js
var require_variable_with_values = __commonJS({
  "node_modules/@openmeteo/sdk/variable-with-values.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VariableWithValues = void 0;
    var flatbuffers = __importStar(require_flatbuffers());
    var aggregation_js_1 = require_aggregation();
    var unit_js_1 = require_unit();
    var variable_js_1 = require_variable();
    var VariableWithValues = class _VariableWithValues {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsVariableWithValues(bb, obj) {
        return (obj || new _VariableWithValues()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsVariableWithValues(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new _VariableWithValues()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      variable() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : variable_js_1.Variable.undefined;
      }
      unit() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : unit_js_1.Unit.undefined;
      }
      value() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      values(index) {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
      }
      valuesLength() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      valuesArray() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
      }
      valuesInt64(index) {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt64(this.bb.__vector(this.bb_pos + offset) + index * 8) : BigInt(0);
      }
      valuesInt64Length() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      altitude() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      aggregation() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : aggregation_js_1.Aggregation.none;
      }
      pressureLevel() {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      depth() {
        const offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      depthTo() {
        const offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      ensembleMember() {
        const offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      previousDay() {
        const offset = this.bb.__offset(this.bb_pos, 26);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
    };
    exports.VariableWithValues = VariableWithValues;
  }
});

// node_modules/@openmeteo/sdk/variables-with-time.js
var require_variables_with_time = __commonJS({
  "node_modules/@openmeteo/sdk/variables-with-time.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VariablesWithTime = void 0;
    var flatbuffers = __importStar(require_flatbuffers());
    var variable_with_values_js_1 = require_variable_with_values();
    var VariablesWithTime = class _VariablesWithTime {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsVariablesWithTime(bb, obj) {
        return (obj || new _VariablesWithTime()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsVariablesWithTime(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new _VariablesWithTime()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      time() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt("0");
      }
      timeEnd() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt("0");
      }
      interval() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      variables(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? (obj || new variable_with_values_js_1.VariableWithValues()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      variablesLength() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
    };
    exports.VariablesWithTime = VariablesWithTime;
  }
});

// node_modules/@openmeteo/sdk/weather-api-response.js
var require_weather_api_response = __commonJS({
  "node_modules/@openmeteo/sdk/weather-api-response.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WeatherApiResponse = void 0;
    var flatbuffers = __importStar(require_flatbuffers());
    var model_js_1 = require_model();
    var variables_with_time_js_1 = require_variables_with_time();
    var WeatherApiResponse = class _WeatherApiResponse {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsWeatherApiResponse(bb, obj) {
        return (obj || new _WeatherApiResponse()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsWeatherApiResponse(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new _WeatherApiResponse()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      latitude() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      longitude() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      elevation() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      generationTimeMilliseconds() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      locationId() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt("0");
      }
      model() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readUint8(this.bb_pos + offset) : model_js_1.Model.undefined;
      }
      utcOffsetSeconds() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      timezone(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      timezoneAbbreviation(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      current(obj) {
        const offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
      }
      daily(obj) {
        const offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
      }
      hourly(obj) {
        const offset = this.bb.__offset(this.bb_pos, 26);
        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
      }
      minutely15(obj) {
        const offset = this.bb.__offset(this.bb_pos, 28);
        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
      }
      sixHourly(obj) {
        const offset = this.bb.__offset(this.bb_pos, 30);
        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
      }
    };
    exports.WeatherApiResponse = WeatherApiResponse;
  }
});

// node_modules/openmeteo/lib/index.js
var require_lib = __commonJS({
  "node_modules/openmeteo/lib/index.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fetchWeatherApi = void 0;
    var flatbuffers_1 = require_flatbuffers();
    var weather_api_response_1 = require_weather_api_response();
    var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    function fetchRetried(url_1) {
      return __awaiter(this, arguments, void 0, function* (url2, retries = 3, backoffFactor = 0.5, backoffMax = 2) {
        const statusToRetry = [500, 502, 504];
        const statusWithJsonError = [400, 429];
        let currentTry = 0;
        let response = yield fetch(url2);
        while (statusToRetry.includes(response.status)) {
          currentTry++;
          if (currentTry >= retries) {
            throw new Error(response.statusText);
          }
          const sleepMs = Math.min(backoffFactor * Math.pow(2, currentTry), backoffMax) * 1e3;
          yield sleep(sleepMs);
          response = yield fetch(url2);
        }
        if (statusWithJsonError.includes(response.status)) {
          const json = yield response.json();
          if ("reason" in json) {
            throw new Error(json.reason);
          }
          throw new Error(response.statusText);
        }
        return response;
      });
    }
    function fetchWeatherApi2(url_1, params_1) {
      return __awaiter(this, arguments, void 0, function* (url2, params, retries = 3, backoffFactor = 0.2, backoffMax = 2) {
        const urlParams = new URLSearchParams(params);
        urlParams.set("format", "flatbuffers");
        const response = yield fetchRetried(`${url2}?${urlParams.toString()}`, retries, backoffFactor, backoffMax);
        const fb = new flatbuffers_1.ByteBuffer(new Uint8Array(yield response.arrayBuffer()));
        const results = [];
        let pos = 0;
        while (pos < fb.capacity()) {
          fb.setPosition(pos);
          const len = fb.readInt32(fb.position());
          results.push(weather_api_response_1.WeatherApiResponse.getSizePrefixedRootAsWeatherApiResponse(fb));
          pos += len + 4;
        }
        return results;
      });
    }
    exports.fetchWeatherApi = fetchWeatherApi2;
  }
});

// node_modules/@deskthing/types/dist/apps/appSettings.js
var SETTING_TYPES;
(function(SETTING_TYPES3) {
  SETTING_TYPES3["BOOLEAN"] = "boolean";
  SETTING_TYPES3["NUMBER"] = "number";
  SETTING_TYPES3["STRING"] = "string";
  SETTING_TYPES3["RANGE"] = "range";
  SETTING_TYPES3["SELECT"] = "select";
  SETTING_TYPES3["MULTISELECT"] = "multiselect";
  SETTING_TYPES3["LIST"] = "list";
  SETTING_TYPES3["RANKED"] = "ranked";
  SETTING_TYPES3["COLOR"] = "color";
  SETTING_TYPES3["FILE"] = "file";
})(SETTING_TYPES || (SETTING_TYPES = {}));

// node_modules/@deskthing/types/dist/deskthing/deskthingTransit.js
var DESKTHING_DEVICE;
(function(DESKTHING_DEVICE3) {
  DESKTHING_DEVICE3["GLOBAL_SETTINGS"] = "global_settings";
  DESKTHING_DEVICE3["MAPPINGS"] = "button_mappings";
  DESKTHING_DEVICE3["CONFIG"] = "configuration";
  DESKTHING_DEVICE3["GET"] = "get";
  DESKTHING_DEVICE3["ERROR"] = "error";
  DESKTHING_DEVICE3["PONG"] = "pong";
  DESKTHING_DEVICE3["PING"] = "ping";
  DESKTHING_DEVICE3["SETTINGS"] = "settings";
  DESKTHING_DEVICE3["APPS"] = "apps";
  DESKTHING_DEVICE3["TIME"] = "time";
  DESKTHING_DEVICE3["HEARTBEAT"] = "heartbeat";
  DESKTHING_DEVICE3["META_DATA"] = "meta_data";
  DESKTHING_DEVICE3["MUSIC"] = "music";
  DESKTHING_DEVICE3["ICON"] = "icon";
})(DESKTHING_DEVICE || (DESKTHING_DEVICE = {}));
var DESKTHING_EVENTS;
(function(DESKTHING_EVENTS3) {
  DESKTHING_EVENTS3["MESSAGE"] = "message";
  DESKTHING_EVENTS3["DATA"] = "data";
  DESKTHING_EVENTS3["APPDATA"] = "appdata";
  DESKTHING_EVENTS3["CALLBACK_DATA"] = "callback-data";
  DESKTHING_EVENTS3["START"] = "start";
  DESKTHING_EVENTS3["STOP"] = "stop";
  DESKTHING_EVENTS3["PURGE"] = "purge";
  DESKTHING_EVENTS3["INPUT"] = "input";
  DESKTHING_EVENTS3["ACTION"] = "action";
  DESKTHING_EVENTS3["CONFIG"] = "config";
  DESKTHING_EVENTS3["SETTINGS"] = "settings";
  DESKTHING_EVENTS3["TASKS"] = "tasks";
  DESKTHING_EVENTS3["CLIENT_STATUS"] = "client_status";
})(DESKTHING_EVENTS || (DESKTHING_EVENTS = {}));

// node_modules/@deskthing/server/dist/index.js
import * as fs from "fs";
import * as path from "path";
import { Worker } from "worker_threads";
import { parentPort } from "worker_threads";
var SETTING_TYPES2;
(function(SETTING_TYPES22) {
  SETTING_TYPES22["BOOLEAN"] = "boolean";
  SETTING_TYPES22["NUMBER"] = "number";
  SETTING_TYPES22["STRING"] = "string";
  SETTING_TYPES22["RANGE"] = "range";
  SETTING_TYPES22["SELECT"] = "select";
  SETTING_TYPES22["MULTISELECT"] = "multiselect";
  SETTING_TYPES22["LIST"] = "list";
  SETTING_TYPES22["RANKED"] = "ranked";
  SETTING_TYPES22["COLOR"] = "color";
  SETTING_TYPES22["FILE"] = "file";
})(SETTING_TYPES2 || (SETTING_TYPES2 = {}));
var STEP_TYPES;
(function(STEP_TYPES2) {
  STEP_TYPES2["ACTION"] = "action";
  STEP_TYPES2["SHORTCUT"] = "shortcut";
  STEP_TYPES2["SETTING"] = "setting";
  STEP_TYPES2["TASK"] = "task";
  STEP_TYPES2["EXTERNAL"] = "external";
  STEP_TYPES2["STEP"] = "step";
})(STEP_TYPES || (STEP_TYPES = {}));
var APP_REQUESTS;
(function(APP_REQUESTS2) {
  APP_REQUESTS2["DEFAULT"] = "default";
  APP_REQUESTS2["GET"] = "get";
  APP_REQUESTS2["SET"] = "set";
  APP_REQUESTS2["DELETE"] = "delete";
  APP_REQUESTS2["OPEN"] = "open";
  APP_REQUESTS2["SEND"] = "send";
  APP_REQUESTS2["TOAPP"] = "toApp";
  APP_REQUESTS2["LOG"] = "log";
  APP_REQUESTS2["KEY"] = "key";
  APP_REQUESTS2["ACTION"] = "action";
  APP_REQUESTS2["TASK"] = "task";
  APP_REQUESTS2["STEP"] = "step";
  APP_REQUESTS2["SONG"] = "song";
})(APP_REQUESTS || (APP_REQUESTS = {}));
var DESKTHING_DEVICE2;
(function(DESKTHING_DEVICE22) {
  DESKTHING_DEVICE22["GLOBAL_SETTINGS"] = "global_settings";
  DESKTHING_DEVICE22["MAPPINGS"] = "button_mappings";
  DESKTHING_DEVICE22["CONFIG"] = "configuration";
  DESKTHING_DEVICE22["GET"] = "get";
  DESKTHING_DEVICE22["ERROR"] = "error";
  DESKTHING_DEVICE22["PONG"] = "pong";
  DESKTHING_DEVICE22["PING"] = "ping";
  DESKTHING_DEVICE22["SETTINGS"] = "settings";
  DESKTHING_DEVICE22["APPS"] = "apps";
  DESKTHING_DEVICE22["TIME"] = "time";
  DESKTHING_DEVICE22["HEARTBEAT"] = "heartbeat";
  DESKTHING_DEVICE22["META_DATA"] = "meta_data";
  DESKTHING_DEVICE22["MUSIC"] = "music";
  DESKTHING_DEVICE22["ICON"] = "icon";
})(DESKTHING_DEVICE2 || (DESKTHING_DEVICE2 = {}));
var DESKTHING_EVENTS2;
(function(DESKTHING_EVENTS22) {
  DESKTHING_EVENTS22["MESSAGE"] = "message";
  DESKTHING_EVENTS22["DATA"] = "data";
  DESKTHING_EVENTS22["APPDATA"] = "appdata";
  DESKTHING_EVENTS22["CALLBACK_DATA"] = "callback-data";
  DESKTHING_EVENTS22["START"] = "start";
  DESKTHING_EVENTS22["STOP"] = "stop";
  DESKTHING_EVENTS22["PURGE"] = "purge";
  DESKTHING_EVENTS22["INPUT"] = "input";
  DESKTHING_EVENTS22["ACTION"] = "action";
  DESKTHING_EVENTS22["CONFIG"] = "config";
  DESKTHING_EVENTS22["SETTINGS"] = "settings";
  DESKTHING_EVENTS22["TASKS"] = "tasks";
  DESKTHING_EVENTS22["CLIENT_STATUS"] = "client_status";
})(DESKTHING_EVENTS2 || (DESKTHING_EVENTS2 = {}));
var EventFlavor;
(function(EventFlavor2) {
  EventFlavor2[EventFlavor2["KeyUp"] = 0] = "KeyUp";
  EventFlavor2[EventFlavor2["KeyDown"] = 1] = "KeyDown";
  EventFlavor2[EventFlavor2["ScrollUp"] = 2] = "ScrollUp";
  EventFlavor2[EventFlavor2["ScrollDown"] = 3] = "ScrollDown";
  EventFlavor2[EventFlavor2["ScrollLeft"] = 4] = "ScrollLeft";
  EventFlavor2[EventFlavor2["ScrollRight"] = 5] = "ScrollRight";
  EventFlavor2[EventFlavor2["SwipeUp"] = 6] = "SwipeUp";
  EventFlavor2[EventFlavor2["SwipeDown"] = 7] = "SwipeDown";
  EventFlavor2[EventFlavor2["SwipeLeft"] = 8] = "SwipeLeft";
  EventFlavor2[EventFlavor2["SwipeRight"] = 9] = "SwipeRight";
  EventFlavor2[EventFlavor2["PressShort"] = 10] = "PressShort";
  EventFlavor2[EventFlavor2["PressLong"] = 11] = "PressLong";
})(EventFlavor || (EventFlavor = {}));
var EventMode;
(function(EventMode3) {
  EventMode3[EventMode3["KeyUp"] = 0] = "KeyUp";
  EventMode3[EventMode3["KeyDown"] = 1] = "KeyDown";
  EventMode3[EventMode3["ScrollUp"] = 2] = "ScrollUp";
  EventMode3[EventMode3["ScrollDown"] = 3] = "ScrollDown";
  EventMode3[EventMode3["ScrollLeft"] = 4] = "ScrollLeft";
  EventMode3[EventMode3["ScrollRight"] = 5] = "ScrollRight";
  EventMode3[EventMode3["SwipeUp"] = 6] = "SwipeUp";
  EventMode3[EventMode3["SwipeDown"] = 7] = "SwipeDown";
  EventMode3[EventMode3["SwipeLeft"] = 8] = "SwipeLeft";
  EventMode3[EventMode3["SwipeRight"] = 9] = "SwipeRight";
  EventMode3[EventMode3["PressShort"] = 10] = "PressShort";
  EventMode3[EventMode3["PressLong"] = 11] = "PressLong";
})(EventMode || (EventMode = {}));
var isValidAction = (action) => {
  if (!action || typeof action !== "object") throw new Error("Action must be an object");
  const actionObj = action;
  if (typeof actionObj.id !== "string") throw new Error("Action id must be a string");
  if (typeof actionObj.version !== "string") {
    throw new Error("Action version must be a string");
  }
  if (typeof actionObj.enabled !== "boolean") {
    throw new Error("Action enabled must be a boolean");
  }
  if (typeof actionObj.name !== "string") {
    throw new Error("Action name must be a string");
  }
  if (typeof actionObj.version_code !== "number") {
    throw new Error("Action version_code must be a number");
  }
  if (actionObj.description !== void 0 && typeof actionObj.description !== "string") {
    throw new Error("Action description must be a string");
  }
  if (actionObj.value !== void 0 && typeof actionObj.value !== "string") {
    throw new Error("Action value must be a string");
  }
  if (actionObj.value_options !== void 0 && !Array.isArray(actionObj.value_options)) {
    throw new Error("Action value_options must be an array of strings");
  }
  if (actionObj.value_instructions !== void 0 && typeof actionObj.value_instructions !== "string") {
    throw new Error("Action value_instructions must be a string");
  }
  if (actionObj.icon !== void 0 && typeof actionObj.icon !== "string") {
    throw new Error("Action icon must be a string");
  }
  if (actionObj.tag !== void 0 && !["nav", "media", "basic"].includes(actionObj.tag)) {
    throw new Error("Action tag must be one of: nav, media, basic");
  }
};
var isValidActionReference = (action) => {
  if (typeof action !== "object" || !action) {
    throw new Error("validateActionReference: action is not a valid object");
  }
  const actionRef = action;
  if (typeof actionRef.id !== "string") {
    throw new Error("validateActionReference: id is not a valid string");
  }
  if (typeof actionRef.enabled !== "boolean") {
    action.enabled = true;
    console.warn(
      "validateActionReference: enabled was not set to a boolean value"
    );
  }
};
function isValidTask(task) {
  if (!task || typeof task !== "object")
    throw new Error("Task must be an object");
  const t = task;
  if (!t.id) {
    throw new Error("[ValidateTask] Tasks must have an ID");
  }
  if (!t.source) {
    throw new Error(`[ValidateTask] Task ${t.id} does not have a source`);
  }
  if (!t.version) {
    throw new Error(
      `[ValidateTask] Task ${t.id} from ${t.source} must have a specified version`
    );
  }
  if (!t.steps || typeof t.steps !== "object" || Object.values(t.steps).length === 0) {
    throw new Error(
      `[ValidateTask] Task ${t.id} from ${t.source} must have at least one specified step`
    );
  }
  for (const step of Object.values(t.steps)) {
    isValidStep(step);
  }
}
function isValidStep(step) {
  if (!step || typeof step !== "object")
    throw new Error("Step must be an object");
  const s = step;
  if (!s.id) {
    throw new Error("[ValidateStep] Step must have an ID");
  }
  if (!s.type) {
    throw new Error(`[ValidateStep] Step ${s.id} does not have a type`);
  }
  switch (s.type) {
    case STEP_TYPES.ACTION:
      isValidTaskAction(s);
      break;
    case STEP_TYPES.SHORTCUT:
      isValidTaskShortcut(s);
      break;
    case STEP_TYPES.SETTING:
      isValidTaskSetting(s);
      break;
    case STEP_TYPES.TASK:
      isValidTaskTask(s);
      break;
    case STEP_TYPES.EXTERNAL:
      isValidTaskExternal(s);
      break;
    case STEP_TYPES.STEP:
      isValidTaskStep(s);
      break;
    default:
      throw new Error(`[ValidateStep] Step ${s.id} has invalid type ${s.type}`);
  }
}
function validateStepBase(step, expectedType) {
  if (!step || typeof step !== "object")
    throw new Error("Step must be an object");
  const s = step;
  if (!s.type) {
    throw new Error("[ValidateStep] Step must have a type");
  }
  if (s.type !== expectedType) {
    throw new Error(`[ValidateStep] Step ${s.id} is not a ${expectedType}`);
  }
}
function isValidTaskAction(step) {
  validateStepBase(step, STEP_TYPES.ACTION);
  const s = step;
  if (!s.action) {
    throw new Error(
      `[ValidateTaskAction] Step ${s.id} does not have an action`
    );
  }
  const action = s.action;
  if (typeof action === "string") {
    return;
  }
  try {
    if (typeof action === "object" && "version" in action) {
      isValidAction(action);
    } else {
      isValidActionReference(action);
    }
  } catch (error) {
    console.error(`There was an error validating the task action`, error);
  }
}
function isValidTaskShortcut(step) {
  validateStepBase(step, STEP_TYPES.SHORTCUT);
  const s = step;
  if (!s.destination) {
    throw new Error(
      `[ValidateTaskShortcut] Step ${s.id} does not have a destination`
    );
  }
}
function isValidTaskSetting(step) {
  validateStepBase(step, STEP_TYPES.SETTING);
  const s = step;
  if (!s.setting) {
    throw new Error(
      `[ValidateTaskSetting] Step ${s.id} does not have a setting`
    );
  }
  if (!("type" in s.setting)) {
    if (!s.setting.id) throw new Error(`[ValidateTaskSetting] Setting reference does not have an id`);
    return;
  }
  const validTypes = [
    "boolean",
    "list",
    "multiselect",
    "number",
    "range",
    "ranked",
    "select",
    "string",
    "color",
    "file"
  ];
  if (!s.setting.type || !validTypes.includes(s.setting.type)) {
    throw new Error(
      `[ValidateTaskSetting] Step ${s.id} has invalid setting type`
    );
  }
  if (!s.setting.label) {
    throw new Error(
      `[ValidateTaskSetting] Step ${s.id} setting does not have a label`
    );
  }
}
function isValidTaskTask(step) {
  validateStepBase(step, STEP_TYPES.TASK);
  const s = step;
  if (!s.taskReference?.id) {
    throw new Error(`[ValidateTaskTask] Step ${s.id} does not have a taskId`);
  }
}
function isValidTaskExternal(step) {
  validateStepBase(step, STEP_TYPES.EXTERNAL);
}
function isValidTaskStep(step) {
  validateStepBase(step, STEP_TYPES.STEP);
}
var isValidSettings = (setting) => {
  if (!setting) {
    throw new Error("[isValidSetting] Setting must be a valid object");
  }
  if (typeof setting !== "object") {
    throw new Error("[isValidSetting] Setting must be an object");
  }
  if ("type" in setting && typeof setting.type !== "string") {
    throw new Error("[isValidSetting] Setting type must be a string");
  }
  if ("label" in setting && typeof setting.label !== "string") {
    throw new Error("[isValidSetting] Setting label must be a string");
  }
  const typedSetting = setting;
  switch (typedSetting.type) {
    case SETTING_TYPES2.NUMBER:
      if (typeof typedSetting.value !== "number") throw new Error("[isValidSetting] Number setting value must be a number");
      if (typeof typedSetting.min !== "number") throw new Error("[isValidSetting] Number setting min must be a number");
      if (typeof typedSetting.max !== "number") throw new Error("[isValidSetting] Number setting max must be a number");
      break;
    case SETTING_TYPES2.BOOLEAN:
      if (typeof typedSetting.value !== "boolean") throw new Error("[isValidSetting] Boolean setting value must be a boolean");
      break;
    case SETTING_TYPES2.STRING:
      if (typeof typedSetting.value !== "string") throw new Error("[isValidSetting] String setting value must be a string");
      if (typedSetting.maxLength && typeof typedSetting.maxLength !== "number") throw new Error("[isValidSetting] String setting maxLength must be a number");
      break;
    case SETTING_TYPES2.SELECT:
    case SETTING_TYPES2.MULTISELECT:
    case SETTING_TYPES2.RANKED:
    case SETTING_TYPES2.LIST:
      if (!Array.isArray(typedSetting.options)) throw new Error(`[isValidSetting] ${typedSetting.type} setting must have options array`);
      typedSetting.options.forEach((option) => {
        if (typeof option.label !== "string") throw new Error("[isValidSetting] Option label must be a string");
        if (typeof option.value !== "string") throw new Error("[isValidSetting] Option value must be a string");
      });
      break;
    case SETTING_TYPES2.RANGE:
      if (typeof typedSetting.value !== "number") throw new Error("[isValidSetting] Range setting value must be a number");
      if (typeof typedSetting.min !== "number") throw new Error("[isValidSetting] Range setting min must be a number");
      if (typeof typedSetting.max !== "number") throw new Error("[isValidSetting] Range setting max must be a number");
      if (typedSetting.step && typeof typedSetting.step !== "number") throw new Error("[isValidSetting] Range setting step must be a number");
      break;
    case SETTING_TYPES2.COLOR:
      if (typeof typedSetting.value !== "string") throw new Error("[isValidSetting] Color setting value must be a string");
      break;
    case SETTING_TYPES2.FILE:
      break;
    // nothing is needed technically speaking
    default:
      throw new Error(`[isValidSetting] Invalid setting type: ${JSON.stringify(typedSetting)}`);
  }
};
var sanitizeSettings = (setting) => {
  isValidSettings(setting);
  const commonSettings = {
    disabled: setting.disabled,
    id: setting.id,
    label: setting.label || setting.id || "",
    value: setting.value,
    source: setting.source,
    description: setting.description || "No Description"
  };
  switch (setting.type) {
    case SETTING_TYPES2.SELECT:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.SELECT,
        value: setting.value,
        label: setting.label,
        description: setting.description || "",
        placeholder: setting.placeholder,
        options: setting.options
      };
      break;
    case SETTING_TYPES2.MULTISELECT:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.MULTISELECT,
        value: setting.value,
        label: setting.label,
        description: setting.description || "",
        placeholder: setting.placeholder,
        options: setting.options
      };
      break;
    case SETTING_TYPES2.NUMBER:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.NUMBER,
        value: setting.value,
        label: setting.label,
        min: setting.min,
        max: setting.max,
        description: setting.description || ""
      };
      break;
    case SETTING_TYPES2.BOOLEAN:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.BOOLEAN,
        value: setting.value,
        description: setting.description || "",
        label: setting.label
      };
      break;
    case SETTING_TYPES2.STRING:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.STRING,
        description: setting.description || "",
        value: setting.value,
        label: setting.label
      };
      break;
    case SETTING_TYPES2.RANGE:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.RANGE,
        value: setting.value,
        label: setting.label,
        min: setting.min,
        max: setting.max,
        step: setting.step || 1,
        description: setting.description || ""
      };
      break;
    case SETTING_TYPES2.RANKED:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.RANKED,
        value: setting.value,
        label: setting.label,
        description: setting.description || "",
        options: setting.options
      };
      break;
    case SETTING_TYPES2.LIST:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.LIST,
        value: setting.value,
        label: setting.label,
        unique: setting.unique,
        orderable: setting.orderable,
        placeholder: setting.placeholder,
        maxValues: setting.maxValues,
        description: setting.description || "",
        options: setting.options || []
      };
      break;
    case SETTING_TYPES2.COLOR:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.COLOR,
        value: setting.value,
        label: setting.label,
        description: setting.description || ""
      };
      break;
    case SETTING_TYPES2.FILE:
      setting = {
        ...commonSettings,
        type: SETTING_TYPES2.FILE,
        value: setting.value,
        label: setting.label,
        fileTypes: setting.fileTypes || [],
        placeholder: setting.placeholder || ""
      };
      break;
    default:
      throw new Error(`[isValidSetting] Unknown setting type: ${setting}`);
  }
  return setting;
};
var settingHasOptions = (setting) => {
  if (!setting) throw new Error("[settingHasOptions] Setting must be defined");
  if (!setting.type) throw new Error("[settingHasOptions] Setting type must be defined");
  return setting.type === SETTING_TYPES2.RANKED || setting.type === SETTING_TYPES2.LIST || setting.type === SETTING_TYPES2.SELECT || setting.type === SETTING_TYPES2.MULTISELECT;
};
var isValidAppDataInterface = (app) => {
  if (!app) {
    throw new Error("App data interface is undefined");
  }
  if (typeof app !== "object") {
    throw new Error("App data interface is not an object");
  }
  if (!app.version) {
    throw new Error("App data interface version is undefined");
  }
  if (app.settings) {
    isValidAppSettings(app.settings);
  }
  if (app.tasks) {
    Object.values(app.tasks).forEach((task) => {
      isValidTask(task);
    });
  }
  if (app.actions) {
    Object.values(app.actions).forEach((action) => {
      isValidAction2(action);
    });
  }
  if (app.keys) {
    Object.values(app.keys).forEach((key) => {
      isValidKey(key);
    });
  }
};
var isValidAction2 = (action) => {
  if (!action || typeof action !== "object") throw new Error("Action must be an object");
  const actionObj = action;
  if (typeof actionObj.id !== "string") throw new Error("Action id must be a string");
  if (typeof actionObj.source !== "string") throw new Error("Action source must be a string");
  if (typeof actionObj.version !== "string") {
    actionObj.version = "0.0.0";
    console.warn("WARNING_MISSING_ACTION_VERSION");
  }
  if (typeof actionObj.enabled !== "boolean") {
    actionObj.enabled = true;
    console.warn("WARNING_MISSING_ACTION_ENABLED");
  }
};
var isValidKey = (key) => {
  if (!key || typeof key !== "object") throw new Error("Key must be an object");
  const keyObj = key;
  if (typeof keyObj.id !== "string") throw new Error("Key id must be a string");
  if (typeof keyObj.source !== "string")
    throw new Error("Key source must be a string");
  if (typeof keyObj.version !== "string")
    throw new Error("Key version must be a string");
  if (typeof keyObj.enabled !== "boolean")
    throw new Error("Key enabled must be a boolean");
  if (!Array.isArray(keyObj.modes))
    throw new Error("Key modes must be an array");
  if (!keyObj.modes.every((Mode) => Object.values(EventMode).includes(Mode))) {
    throw new Error("Key modes must all be valid EventMode values");
  }
};
var isValidAppSettings = (appSettings) => {
  if (typeof appSettings !== "object") {
    throw new Error("[sanitizeAppSettings] App settings must be an object");
  }
  Object.entries(appSettings).forEach(([key, setting]) => {
    if (typeof setting !== "object") {
      throw new Error("[sanitizeAppSettings] App settings must be an object");
    }
    try {
      isValidSettings(setting);
    } catch (error) {
      console.error(`Failed to validate settings!`, error);
    }
  });
};
var DeskThingClass = class _DeskThingClass {
  constructor() {
    this.manifest = null;
    this.imageUrls = {};
    this.Listeners = {};
    this.sysListeners = [];
    this.backgroundTasks = [];
    this.stopRequested = false;
    this.fetch = async (requestData, listenData, callback, timeoutMs = 5e3) => {
      if (!requestData.type) {
        console.warn(`[fetch]: Request Data doesn't have a "type" field`);
        return void 0;
      }
      this.sendToServer(requestData);
      if (!listenData) return void 0;
      try {
        const dataPromise = new Promise(
          (resolve2) => {
            let timeoutId = null;
            let isResolved = false;
            const handleResolve = (data) => {
              if (isResolved) return;
              isResolved = true;
              if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
              }
              resolve2(data);
            };
            timeoutId = setTimeout(() => {
              console.debug(`[fetch]: Request timed out after ${timeoutMs}ms for type: ${listenData.type}`);
              handleResolve(void 0);
            }, timeoutMs);
            try {
              this.once(
                listenData.type,
                (data) => handleResolve(data),
                listenData.request
              ).catch((error) => {
                console.warn(`[fetch]: Error during fetch listener! ${error}`);
                handleResolve(void 0);
              });
            } catch (error) {
              console.warn(`[fetch]: Error during fetch listener setup! ${error}`);
              handleResolve(void 0);
            }
          }
        );
        const response = await dataPromise;
        if (callback) {
          try {
            await callback(response);
          } catch (error) {
            console.warn(
              `[fetch]: Error during fetch callback! ${error instanceof Error ? error.message : error}`
            );
          }
        }
        return response;
      } catch (error) {
        console.warn(
          `[fetch]: Error during deskthing fetch! ${error instanceof Error ? error.message : error}`
        );
        if (callback) {
          try {
            await callback(void 0);
          } catch (error2) {
            console.warn(
              `[fetch]: Error during errored callback! ${error2 instanceof Error ? error2.message : error2}`
            );
          }
        }
        return void 0;
      }
    };
    this.setSettings = async (settings) => {
      console.log("Adding settings... " + Object.keys(settings).toString());
      const existingSettings = await this.getSettings() || {};
      if (!settings || typeof settings !== "object") {
        throw new Error("Settings must be a valid object");
      }
      Object.entries(settings).forEach(([id, setting]) => {
        if (!setting.type || !setting.label) {
          throw new Error(`Setting ${id} must have a type and label`);
        }
        try {
          existingSettings[id] = { ...sanitizeSettings(setting), id };
        } catch (error) {
          if (error instanceof Error) {
            console.error(
              `Error sanitizing setting with label "${setting.label}": ${error.message}`
            );
          } else {
            console.error(
              `Error sanitizing setting with label "${setting.label}": ${error}`
            );
          }
        }
      });
      console.log("Saving settings");
      this.saveSettings(existingSettings);
    };
    this.setSettingOptions = async (settingId, options) => {
      const existingSettings = await this.getSettings();
      if (!existingSettings?.[settingId]) {
        console.error(`Setting with id ${settingId} not found`);
        return;
      }
      try {
        settingHasOptions(existingSettings[settingId]);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        return;
      }
      existingSettings[settingId].options = options;
      this.saveSettings(existingSettings);
    };
    this.tasks = {
      /**
       * Adds a new task.
       * @throws {Error} - when the data is invalid.
       * @param taskData - The data for the new task.
       * @example
       * deskthing.tasks.add({
       *    id: 'task-id',
       *    version: '1.0.0',
       *    available: true,
       *    completed: false,
       *    label: 'Task Name',
       *    started: false,
       *    currentStep: 'step-1',
       *    description: 'Task Description',
       *    steps: {
       *      'step-1': {
       *        id: 'step-1',
       *        type: STEP_TYPES.STEP,
       *        completed: false,
       *        label: 'Step 1',
       *        instructions: 'Step 1 instructions'
       *      }
       *    }
       * });
       */
      add: (taskData) => {
        try {
          const newTask = {
            ...taskData,
            source: this.manifest?.id || "unknown"
          };
          isValidTask(newTask);
          this.sendSocketData(APP_REQUESTS.TASK, { task: newTask }, "add");
        } catch (error) {
          if (error instanceof Error) {
            console.warn("Invalid task data:" + error.message);
          }
          throw error;
        }
      },
      /**
       * Initializes the tasks
       * @throws {Error} - when the data is invalid.
       */
      initTasks: async (taskData) => {
        try {
          const newTasks = Object.entries(taskData).reduce(
            (validatedTasks, [_id, task]) => {
              try {
                const newTask = {
                  ...task,
                  source: this.manifest?.id || "unknown"
                };
                isValidTask(newTask);
                return { ...validatedTasks, [newTask.id]: newTask };
              } catch (error) {
                console.warn(
                  `Task ${task.label || task.id} failed to be verified: ` + (error instanceof Error && error.message)
                );
                return validatedTasks;
              }
            },
            {}
          );
          this.sendSocketData(APP_REQUESTS.TASK, { tasks: newTasks }, "init");
        } catch (error) {
          console.warn(
            "Invalid task data:" + (error instanceof Error && error.message)
          );
        }
      },
      /**
       * Updates a specific step within a task
       * @param taskId - The ID of the task containing the step
       * @param stepId - The ID of the step to update
       * @param updates - The partial step data to update
       * @example
       * deskthing.tasks.update('task-id', 'step-1', {
       *   completed: true,
       *   label: 'Updated Step Label',
       *   instructions: 'New instructions'
       * });
       */
      update: (taskId, task) => {
        const validStepFields = [
          "id",
          "label",
          "completed",
          "currentStep",
          "started",
          "source",
          "version",
          "available",
          "description",
          "steps"
        ];
        const sanitizedUpdates = Object.fromEntries(
          Object.entries(task).filter(
            ([key]) => validStepFields.includes(key)
          )
        );
        this.sendSocketData(
          APP_REQUESTS.TASK,
          { taskId, task: { ...sanitizedUpdates, id: taskId } },
          "update"
        );
      },
      /**
       * Deletes a task by its ID
       * @param taskId - The ID of the task to delete
       * @example
       * deskthing.tasks.delete('task-id');
       */
      delete: (taskId) => {
        this.sendSocketData(APP_REQUESTS.TASK, { taskId }, "delete");
      },
      /**
       * Marks a task as completed
       * @param taskId - The ID of the task to complete
       * @example
       * deskthing.tasks.complete('task-id');
       */
      complete: (taskId) => {
        this.sendSocketData(APP_REQUESTS.TASK, { taskId }, "complete");
      },
      /**
       * Restarts a task, resetting its progress
       * @param taskId - The ID of the task to restart
       * @example
       * deskthing.tasks.restart('task-id');
       */
      restart: (taskId) => {
        this.sendSocketData(APP_REQUESTS.TASK, { taskId }, "restart");
      },
      /**
       * Marks a task as started
       * @param taskId - The ID of the task to start
       * @example
       * deskthing.tasks.start('task-id');
       */
      start: (taskId) => {
        this.sendSocketData(APP_REQUESTS.TASK, { taskId }, "start");
      },
      /**
       * Ends a task without completing it
       * @param taskId - The ID of the task to end
       * @example
       * deskthing.tasks.end('task-id');
       */
      end: (taskId) => {
        this.sendSocketData(APP_REQUESTS.TASK, { taskId }, "end");
      },
      /**
       * Retrieves task information
       * @param taskId - Optional ID of the specific task to get. If omitted, returns all tasks
       * @example
       * // Get all tasks
       * deskthing.tasks.get();
       *
       * // Later, listen for tasks
       * deskthing.on()
       */
      get: () => {
        this.sendSocketData(APP_REQUESTS.TASK, {}, "get");
      }
    };
    this.steps = {
      /**
       * Adds a new step to the specified task.
       * @param taskId - The unique identifier of the task to which the step belongs.
       * @param stepData - The data for the new step.
       * @example
       * // Basic step
       * deskthing.steps.add('task-id', {
       *    id: 'step-id',
       *    type: STEP_TYPES.STEP,
       *    label: 'Step Name',
       *    instructions: 'Step Description',
       *    completed: false,
       *    debug: false,
       *    strict: false,
       *    parentId: 'parent-task-id'
       * });
       *
       * // Action step
       * deskthing.steps.add('task-id', {
       *    id: 'action-step',
       *    type: STEP_TYPES.ACTION,
       *    label: 'Run Action',
       *    instructions: 'Execute this action',
       *    completed: false,
       *    action: {
       *      id: 'action-id',
       *      value: 'example-value',
       *      enabled: true,
       *      source: 'system'
       *    } as ActionReference
       * });
       *
       * // External step
       * deskthing.steps.add('task-id', {
       *    id: 'external-step',
       *    type: STEP_TYPES.EXTERNAL,
       *    label: 'External Task',
       *    instructions: 'Complete this external task',
       *    completed: false,
       *    url: 'https://example.com'
       * });
       *
       * // Task step
       * deskthing.steps.add('task-id', {
       *    id: 'task-step',
       *    type: STEP_TYPES.TASK,
       *    label: 'Complete Task',
       *    instructions: 'Complete the referenced task',
       *    completed: false,
       *    taskId: 'referenced-task-id'
       * });
       *
       * // Shortcut step
       * deskthing.steps.add('task-id', {
       *    id: 'shortcut-step',
       *    type: STEP_TYPES.SHORTCUT,
       *    label: 'Navigate',
       *    instructions: 'Go to location',
       *    completed: false,
       *    destination: 'settings/general'
       * });
       *
       * // Setting step
       * deskthing.steps.add('task-id', {
       *    id: 'setting-step',
       *    type: STEP_TYPES.SETTING,
       *    label: 'Configure Setting',
       *    instructions: 'Set up configuration',
       *    completed: false,
       *    setting: {
       *      value: 'example',
       *      type: 'string',
       *      label: 'Example Setting',
       *      description: 'An example string setting'
       *    } as SettingsString
       * });
       * @throws {Error} If the step data is invalid.
       */
      add: (taskId, stepData) => {
        try {
          isValidStep(stepData);
          this.sendSocketData(APP_REQUESTS.STEP, { taskId, step: stepData }, "add");
        } catch (error) {
          if (error instanceof Error) {
            console.warn("Invalid step data:" + error.message);
          }
        }
      },
      /**
       * Updates an existing step with the provided updates.
       * Only allows updating valid step fields and sanitizes the input.
       *
       * @param taskId - The ID of the task containing the step
       * @param stepId - The ID of the step to update
       * @param updates - Partial Step object containing the fields to update
       */
      update: (taskId, stepId, updates) => {
        const validStepFields = [
          "parentId",
          "id",
          "debug",
          "strict",
          "type",
          "label",
          "instructions",
          "completed",
          "debugging",
          "source",
          "action",
          "url",
          "taskId",
          "taskSource",
          "destination",
          "setting"
        ];
        const sanitizedUpdates = Object.fromEntries(
          Object.entries(updates).filter(([key]) => validStepFields.includes(key))
        );
        this.sendSocketData(
          APP_REQUESTS.STEP,
          { taskId, stepId, step: { ...sanitizedUpdates, id: stepId } },
          "update"
        );
      },
      /**
       * Deletes a step from a task.
       *
       * @param taskId - The ID of the task containing the step
       * @param stepId - The ID of the step to delete
       */
      delete: (taskId, stepId) => {
        this.sendSocketData(APP_REQUESTS.STEP, { taskId, stepId }, "delete");
      },
      /**
       * Marks a step as completed.
       *
       * @param taskId - The ID of the task containing the step
       * @param stepId - The ID of the step to complete
       */
      complete: (taskId, stepId) => {
        this.sendSocketData(APP_REQUESTS.STEP, { taskId, stepId }, "complete");
      },
      /**
       * Restarts a step by resetting its state.
       *
       * @param taskId - The ID of the task containing the step
       * @param stepId - The ID of the step to restart
       */
      restart: (taskId, stepId) => {
        this.sendSocketData(APP_REQUESTS.STEP, { taskId, stepId }, "restart");
      },
      /**
       * Retrieves a specific step from a task.
       *
       * @param taskId - The ID of the task containing the step
       * @param stepId - The ID of the step to retrieve
       */
      get: (taskId, stepId) => {
        this.sendSocketData(APP_REQUESTS.STEP, { taskId, stepId }, "get");
      }
    };
    this.sendToServer = async (data) => {
      this.postProcessMessage({
        version: _DeskThingClass.version,
        type: "data",
        payload: data
      });
    };
    this.postProcessMessage = async (data) => {
      if (parentPort?.postMessage) {
        parentPort.postMessage(data);
      } else {
        console.error("Parent port or postmessage is undefined!");
      }
    };
    this.loadManifest();
    this.initializeListeners();
  }
  static {
    this.version = "0.11.0";
  }
  initializeListeners() {
    parentPort?.on("message", async (data) => {
      switch (data.type) {
        case "data":
          this.handleServerMessage(data.payload);
          break;
        case "start":
          this.postProcessMessage({
            version: _DeskThingClass.version,
            type: "started"
          });
          this.stopRequested = false;
          await this.notifyListeners(DESKTHING_EVENTS2.START, {
            type: DESKTHING_EVENTS2.START
          });
          break;
        case "stop":
          try {
            await this.notifyListeners(DESKTHING_EVENTS2.STOP, {
              type: DESKTHING_EVENTS2.STOP
            });
            this.stopRequested = true;
            this.backgroundTasks.forEach((cancel) => cancel());
            this.backgroundTasks = [];
          } catch (error) {
            console.error("Error in stop:", error);
          }
          this.postProcessMessage({
            version: _DeskThingClass.version,
            type: "stopped"
          });
          break;
        case "purge":
          await this.purge();
          break;
      }
    });
  }
  /**
   * Singleton pattern: Ensures only one instance of DeskThing exists.
   *
   * @since 0.8.0
   * @example
   * const deskThing = DeskThing.getInstance();
   * deskthing.on('start', () => {
   *   // Your code here
   * });
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new _DeskThingClass();
    }
    return this.instance;
  }
  /**
   * Notifies all listeners of a particular event.
   *
   * @since 0.8.0
   * @example
   * deskThing.on('message', (msg) => console.log(msg));
   * deskThing.notifyListeners('message', 'Hello, World!');
   */
  async notifyListeners(event, data) {
    const callbacks = this.Listeners[event];
    if (callbacks) {
      await Promise.all(
        callbacks.map(async (callback) => {
          try {
            await callback(data);
          } catch (error) {
            console.log(
              "Encountered an error in notifyListeners" + (error instanceof Error ? error.message : error)
            );
          }
        })
      );
    }
  }
  /**
   * Registers an event listener for a specific incoming event. Events are either the "type" value of the incoming SocketData object or a special event like "start", "stop", or "data".
   *
   * @since 0.8.0
   * @param event - The event type to listen for.
   * @param callback - The function to call when the event occurs.
   * @returns A function to remove the listener.
   *
   * @example
   * const removeListener = deskThing.on('data', (data) => console.log(data));
   * removeListener(); // To remove the listener
   *
   * @example
   * const removeListener = deskThing.on('start', () => console.log('App is starting'));
   * removeListener(); // To remove the listener
   *
   * @example
   * // When {type: 'get'} is received from the server
   * const removeListener = deskThing.on('get', (socketData) => console.log(socketData.payload));
   * removeListener(); // To remove the listener
   *
   * @example
   * // When a setting is updated. Passes the updated settings object
   * const removeListener = deskThing.on('settings', (settings) => console.log(settings.some_setting.value));
   * removeListener(); // To remove the listener
   *
   * @example
   * // Listening to data from the client
   * // server
   * deskThing.on('set', async (socketData) => {
   *    if (socketData.request === 'loremIpsum') {
   *      handleData(socketData.payload);
   *    }
   * })
   *
   * // client
   * deskThing.send({ type: 'set', request: 'loremIpsum', payload: 'lorem ipsum' });
   *
   * @example
   * // Listening to data from the client
   * // server
   * deskThing.on('doSomething', async (socketData) => {
   *    doSomething()
   * })
   *
   * // client
   * deskThing.send({ type: 'doSomething' });
   */
  on(event, callback) {
    console.log("Registered a new listener for event: " + event);
    if (!this.Listeners[event]) {
      this.Listeners[event] = [];
    }
    this.Listeners[event].push(callback);
    return () => this.off(event, callback);
  }
  /**
   * Removes a specific event listener for a particular incoming event.
   *
   * @since 0.8.0
   * @param event - The event for which to remove the listener.
   * @param callback - The listener function to remove.
   *
   * @example
   * const dataListener = () => console.log('Data received');
   * deskthing.on('data', dataListener);
   * deskthing.off('data', dataListener);
   */
  off(event, callback) {
    if (!this.Listeners[event]) {
      return;
    }
    this.Listeners[event] = this.Listeners[event].filter(
      (cb) => cb !== callback
    );
  }
  /**
   * Registers a one-time listener for an incoming event. The listener will be automatically removed after the first occurrence of the event.
   *
   * Will destructure the response from the server and just return the "payload" field
   *
   * @since 0.10.0
   * @param event - The event to listen for. This is either the 'type' field of SocketData or special cases like 'get' or 'start'
   * @param callback - Optional callback function. If omitted, returns a promise.
   * @returns A promise that resolves with the event data if no callback is provided.
   *
   * @example
   * DeskThing.once('message').then(data => console.log('Received data:', data)); // prints 'hello'
   *
   * // elsewhere
   * send({ type: 'message', payload: 'hello' });
   * @example
   * const flagType = await DeskThing.once('flagType');
   * console.log('Flag type:', flagType);
   * @example
   * await DeskThing.once('flagType', someFunction);
   *
   *
   * @throws
   * if something goes wrong
   */
  async once(event, callback, request) {
    try {
      return new Promise(
        (resolve2) => {
          const onceWrapper = async (data) => {
            if (request && data.request !== request) {
              return;
            }
            this.off(event, onceWrapper);
            if (callback) {
              await callback(data);
            }
            resolve2(data);
          };
          this.on(event, onceWrapper);
        }
      );
    } catch (error) {
      console.warn("Failed to listen for event: " + event);
      throw new Error(
        `Error in once() for app ${this.manifest?.id || "unset"}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * Sends data to the server with a specified event type.
   *
   * @since 0.8.0
   * @param event - The event type to send.
   * @param payload - The data to send.
   * @param request - Optional request string.
   *
   * @example
   * deskThing.sendSocketData('log', { message: 'Logging an event' });
   */
  sendSocketData(event, payload, request) {
    const appData = {
      type: event,
      request,
      payload
    };
    this.sendToServer(appData);
  }
  /**
   * Sends data to the client for the client to listen to
   *
   * @since 0.10.0
   * @param payload - { type: string, payload: any, request?: string }
   *
   * @example
   * // Server
   * deskThing.send({ type: 'message', payload: 'Hello from the Server!' });
   *
   * // Client
   * deskThing.on('message', (data: SocketData) => {
   *   console.log('Received message:', data.payload); // prints 'Hello from the Server!'
   * });
   * @example
   * // Server
   * deskThing.send({ type: 'someFancyData', payload: someDataObject });
   *
   * // Client
   * deskThing.on('someFancyData', (data: SocketData) => {
   *   const someData = data.payload;
   * });
   *
   * @example
   * // Server
   * deskThing.send({type: 'songData', payload: musicData });
   *
   * // Client
   * deskThing.on('songData', (data: SocketData) => {
   *   const musicData = data.payload as SongData;
   * });
   */
  send(payload) {
    const filledPayload = {
      app: this.manifest?.id,
      ...payload
    };
    this.sendSocketData(APP_REQUESTS.SEND, filledPayload);
  }
  sendSong(songData) {
    this.sendSocketData(APP_REQUESTS.SONG, songData);
  }
  /**
   * Routes request to another app running on the server.
   * Ensure that the app you are requesting data from is in your dependency array!
   *
   * @param appId - The ID of the target app.
   * @param data - The data to send to the target app.
   * @since 0.11.0
   * @example
   * deskThing.sendToApp('utility', { type: 'set', request: 'next', payload: { id: '' } });
   * @example
   * deskThing.sendToApp('spotify', { type: 'get', request: 'music' });
   */
  sendToApp(appId, payload) {
    this.sendSocketData(APP_REQUESTS.TOAPP, payload, appId);
  }
  /**
   * Requests the server to open a specified URL.
   *
   * @param url - The URL to open.
   *
   * @example
   * deskThing.openUrl('https://example.com');
   */
  openUrl(url2) {
    this.sendSocketData(APP_REQUESTS.OPEN, url2);
  }
  /**
   * Fetches data from the server if not already retrieved, otherwise returns the cached data.
   * This method also handles queuing requests while data is being fetched.
   *
   * @returns A promise that resolves with the data fetched or the cached data, or null if data is not available.
   *
   * @example
   * const data = await deskThing.getData();
   * console.log('Fetched data:', data);
   */
  async getData() {
    const data = await this.fetch(
      {
        type: APP_REQUESTS.GET,
        request: "data"
      },
      { type: DESKTHING_EVENTS2.DATA }
    );
    if (!data) {
      console.error("[getData]: Data not available");
      return null;
    }
    return data.payload;
  }
  /**
   * Fetches data from the server if not already retrieved, otherwise returns the cached data.
   * This method also handles queuing requests while data is being fetched.
   *
   * @returns A promise that resolves with the data fetched or the cached data, or null if data is not available.
   *
   * @example
   * const data = await deskThing.getData();
   * console.log('Fetched data:', data);
   */
  async getAppData() {
    const data = await this.fetch(
      {
        type: APP_REQUESTS.GET,
        request: "appData"
      },
      {
        type: DESKTHING_EVENTS2.APPDATA
      }
    );
    if (!data) {
      console.error("[getAppData]: Data not available");
      return null;
    }
    return data.payload;
  }
  /**
   * Asynchronously retrieves the current settings. If settings are not defined, it fetches them from the server.
   *
   * @returns The current settings or undefined if not set.
   *
   * @example
   * const settings = deskThing.getSettings();
   * console.log('Current settings:', settings);
   */
  async getSettings() {
    const socketData = await this.fetch(
      {
        type: APP_REQUESTS.GET,
        request: "settings"
      },
      {
        type: DESKTHING_EVENTS2.SETTINGS
      }
    );
    if (!socketData?.payload) {
      console.error("[getSettings]: Settings are not defined!");
      return null;
    }
    return socketData.payload;
  }
  /**
   * Initializes the settings and assumes the settings provided by the server are preferred over the passed settings.
   * Should be used for startup settings and only startup settings
   *
   * @param settings The settings object
   */
  async initSettings(settings) {
    const existingSettings = await this.getSettings();
    const newSettings = Object.fromEntries(
      Object.entries(settings).filter(
        ([key]) => !existingSettings || !(key in existingSettings)
      )
    );
    this.setSettings(newSettings);
  }
  /**
   * Deletes settings from the server
   *
   * @example
   * // Delete a single setting
   * server.deleteSetting('color');
   */
  async deleteSettings(settingIds) {
    this.sendSocketData(APP_REQUESTS.DELETE, settingIds, "settings");
  }
  /**
   * Deletes data from the server
   *
   * @example
   * // Delete a single data item
   * server.deleteData('client_id');
   *
   */
  async deleteData(dataIds) {
    this.sendSocketData(APP_REQUESTS.DELETE, dataIds, "data");
  }
  /**
   * Registers a new action to the server. This can be mapped to any key on the deskthingserver UI.
   *
   * @param action - The action object to register.
   * @throws {Error} If the action object is invalid.
   * @example
   * const action = {
   *      name: 'Like'
   *      description: 'Likes the currently playing song'
   *      id: 'likesong'
   *      value: 'toggle'
   *      value_options: ['like', 'dislike', 'toggle']
   *      value_instructions: 'Determines whether to like, dislike, or toggle the currently liked song'
   *      icon: 'likesongicon' // overrides "id" and instead looks in /public/icons/likesongicon.svg
   *      version: 'v0.10.1'
   *      tag: 'media'
   * }
   * DeskThing.registerAction(action)
   * DeskThing.on('action', (data) => {
   *      if (data.payload.id === 'likesong') {
   *          DeskThing.sendLog('Like Song value is set to: ', data.value)
   *      }
   * })
   * @example
   * // Super minimal action
   * const action = {
   *      id: 'trigger' // looks for icon in /public/icons/trigger.svg
   * }
   * DeskThing.registerAction(action)
   * DeskThing.on('action', (data) => {
   *      if (data.payload.id === 'trigger') {
   *          DeskThing.sendLog('An action was triggered!')
   *      }
   * })
   */
  registerAction(action) {
    if (!action || typeof action !== "object") {
      throw new Error("Invalid action object");
    }
    if (!action.id || typeof action.id !== "string") {
      throw new Error("Action must have a valid id");
    }
    this.sendSocketData(APP_REQUESTS.ACTION, action, "add");
  }
  /**
   * Registers a new action to the server. This can be mapped to any key on the deskthingserver UI.
   *
   * @param action - The action object to register.
   * @throws {Error} If the action object is invalid.
   * @deprecated - Use {@link DeskThing.registerAction} instead.
   * @example
   * const action = {
   *      name: 'Like'
   *      description: 'Likes the currently playing song'
   *      id: 'likesong'
   *      value: 'toggle'
   *      value_options: ['like', 'dislike', 'toggle']
   *      value_instructions: 'Determines whether to like, dislike, or toggle the currently liked song'
   *      icon: 'likesong'
   *      version: 'v0.10.1'
   *      tag: 'media'
   * }
   * DeskThing.registerActionObject(action)
   * DeskThing.on('action', (data) => {
   *      if (data.payload.id === 'likesong') {
   *          DeskThing.sendLog('Like Song value is set to: ', data.value)
   *      }
   * })
   */
  registerActionObject(action) {
    this.registerAction(action);
  }
  /**
   * Updates the flair of a specified action id. This can be used to update the image of the button. Flair is appended to the end of the action name and thus the end of the SVG path as well
   * @param id action id
   * @param flair the updated flair
   * @example
   * // Previously using like.svg
   * deskthing.updateFlair('like', 'active')
   * // Now using likeactive.svg
   */
  updateIcon(actionId, newIcon) {
    this.sendSocketData(APP_REQUESTS.ACTION, { id: actionId, icon: newIcon }, "update");
  }
  /**
   * Registers a new key with the specified identifier. This can be mapped to any action. Use a keycode to map a specific keybind.
   * Possible keycodes can be found at https://www.toptal.com/developers/keycode and is listening for event.code
   *
   * Keys can also be considered "digital" like buttons on the screen.
   * The first number in the key will be passed to the action
   * @deprecated - Use {@link DeskThing.registerKeyObject} instead.
   * @throws {Error} If the key object is invalid.
   * @param id - The unique identifier for the key.
   * @param description - Description for the key.
   */
  registerKey(id, description, modes, version) {
    this.registerKeyObject({ id, description, modes, version });
  }
  /**
   * Registers a new key with the specified identifier. This can be mapped to any action. Use a keycode to map a specific keybind.
   * Possible keycodes can be found at https://www.toptal.com/developers/keycode and is listening for event.code
   *
   * Keys can also be considered "digital" like buttons on the screen.
   * @throws {Error} If the key object is invalid.
   * @param key - The key object to register.
   */
  registerKeyObject(key) {
    if (!key || typeof key !== "object") {
      throw new Error("Invalid key object");
    }
    if (!key.modes || !Array.isArray(key.modes) || key.modes.length === 0) {
      throw new Error("Key must have valid modes");
    }
    if (typeof key.id !== "string") {
      throw new Error("Key must have a valid id");
    }
    const newKey = {
      ...key,
      source: this.manifest?.id || "unknown",
      enabled: true
    };
    this.sendSocketData(APP_REQUESTS.KEY, key, "add");
  }
  /**
   * Removes an action with the specified identifier.
   *
   * @param id - The unique identifier of the action to be removed.
   */
  removeAction(id) {
    this.sendSocketData(APP_REQUESTS.ACTION, { id }, "remove");
  }
  /**
   * Removes a key with the specified identifier.
   *
   * @param id - The unique identifier of the key to be removed.
   */
  removeKey(id) {
    this.sendSocketData(APP_REQUESTS.KEY, { id }, "remove");
  }
  /**
   * Saves the provided data by merging it with the existing appdata and updating settings.
   * Sends the updated data to the server and notifies listeners.
   *
   * @param data - The data to be saved and merged with existing data.
   * @param sync - Whether to sync the data with the server.
   */
  saveAppData(data, sync = true) {
    sync && this.sendSocketData(APP_REQUESTS.SET, data, "appData");
    this.notifyListeners(DESKTHING_EVENTS2.APPDATA, {
      type: DESKTHING_EVENTS2.APPDATA,
      payload: data
    });
  }
  /**
   * Saves the provided data by merging it with the existing data and updating settings.
   * Sends the updated data to the server and notifies listeners.
   *
   * @param data - The data to be saved and merged with existing data.
   */
  saveData(data, sync = true) {
    this.notifyListeners(DESKTHING_EVENTS2.DATA, {
      type: DESKTHING_EVENTS2.DATA,
      payload: data
    });
    sync && this.sendSocketData(APP_REQUESTS.SET, data, "data");
  }
  /**
   * Saves settings to server - overwriting existing settings and notifies listeners
   */
  saveSettings(settings) {
    this.notifyListeners(DESKTHING_EVENTS2.SETTINGS, {
      type: DESKTHING_EVENTS2.SETTINGS,
      payload: settings
    });
    this.sendSocketData(APP_REQUESTS.SET, settings, "settings");
  }
  /**
   * Adds a background task that will loop until either the task is cancelled or the task function returns true.
   * This is useful for tasks that need to run periodically or continuously in the background.
   *
   * Returning TRUE will end the loop and cancel the task
   * Returning FALSE will start another loop after the timeout is completed
   *
   * @param task () => boolean - The background task function to add. This function should return a Promise that resolves to a boolean or void.
   * @param timeout - Optional timeout in milliseconds between task iterations.
   * @returns A function to cancel the background task.
   *
   * @example
   * // Add a background task that logs a message every 5 seconds
   * const cancelTask = deskThing.scheduleTask(async () => {
   *   console.log('Performing periodic task...');
   *   await new Promise(resolve => setTimeout(resolve, 5000));
   *   return false; // Return false to continue the loop
   * });
   *
   * // Later, to stop the task:
   * cancelTask();
   *
   * @example
   * // Add a background task that runs until a condition is met
   * let count = 0;
   * deskThing.scheduleTask(async () => {
   *   console.log(`Task iteration ${++count}`);
   *   if (count >= 10) {
   *     console.log('Task completed');
   *     return true; // Return true to end the loop
   *   }
   *   return false; // Continue the loop
   * });
   *
   * @example
   * // Add a background task that runs every second
   * deskThing.scheduleTask(async () => {
   *   checkForUpdates();
   * }, 1000);
   */
  setInterval(task, timeout) {
    const cancelToken = { cancelled: false };
    const wrappedTask = async () => {
      let endToken = false;
      while (!cancelToken.cancelled && !endToken) {
        endToken = await task() || false;
        if (timeout) {
          await new Promise((resolve2) => setTimeout(resolve2, timeout));
        }
      }
    };
    this.backgroundTasks.push(() => {
      cancelToken.cancelled = true;
    });
    wrappedTask();
    return () => {
      cancelToken.cancelled = true;
    };
  }
  /**
   * Sets a timeout that delays the execution of code
   * The timeout will be cancelled if the app is purged / disabled
   *
   * @returns A function that can be called to cancel the timeout
   */
  setTimeout(fn, timeout) {
    const cancelToken = { cancelled: false };
    const timeoutId = setTimeout(async () => {
      if (!cancelToken.cancelled) {
        await fn();
      }
    }, timeout);
    this.backgroundTasks.push(() => {
      cancelToken.cancelled = true;
      clearTimeout(timeoutId);
    });
    return () => {
      cancelToken.cancelled = true;
      clearTimeout(timeoutId);
    };
  }
  /**
   * @deprecated Use {@link DeskThing.scheduleTask} instead for repeated tasks or {@link DeskThing.addThread} for single-use long-running tasks like websockets
   * @param task
   * @param timeout
   * @returns
   */
  addBackgroundTaskLoop(task, timeout) {
    return this.setInterval(task, timeout);
  }
  /**
   * Creates a new worker thread that runs independently and can be force-killed.
   * Thread is automatically terminated when app closes.
   *
   * @param workerPath - Path to the worker file relative to project root
   * @returns Object containing terminate function and worker instance
   *
   * @example
   * // Main thread
   * DeskThing.on('start', async () => {
   *    const [ remove, worker ] = DeskThing.addThread('./workers/websocket.js');
   *
   *    worker.on('message', (data) => {
   *      DeskThing.log(LOGGING_LEVELS.LOG, `Received message: ${data}`);
   *    });
   *
   *    worker.postMessage({ type: 'send', payload: 'Hello from the main thread!' });
   * })
   * // workers/websocket.ts
   * import { parentPort } from 'worker_threads'
   * import WebSocket from 'ws'
   *
   * const ws = new WebSocket('wss://your-websocket-server.com')
   *
   * ws.on('open', () => {
   *   parentPort?.postMessage({ type: 'connected' })
   * })
   *
   * ws.on('message', (data) => {
   *   parentPort?.postMessage({ type: 'message', data: data.toString() })
   * })
   *
   * ws.on('error', (error) => {
   *   parentPort?.postMessage({ type: 'error', error: error.message })
   * })
   *
   * ws.on('close', () => {
   *   parentPort?.postMessage({ type: 'disconnected' })
   * })
   *
   * // Handle messages from main thread
   * parentPort?.on('message', (message) => {
   *   if (message.type === 'send') {
   *     ws.send(message.payload) // Send message to WebSocket server with content 'Hello from the main thread!'
   *   }
   * })
   *
   * @example // Ex: How to pass data to worker thread
   * import { parentPort, workerData } from 'worker_threads';
   *
   * // Access passed data
   * console.log(workerData.someValue);
   *
   * // Use the data in your worker logic
   * parentPort?.postMessage({
   *     type: 'init',
   *     config: workerData
   * });
   *
   * // Main thread
   * const config = {
   *     interval: 1000,
   *     url: 'wss://example.com'
   * };
   *
   * const [worker, terminate] = DeskThing.addThread('./workers/websocket.js', config);
   */
  addThread(workerPath, workerData) {
    const resolvedPath = path.resolve(__dirname, workerPath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Worker file not found: ${workerPath}`);
    }
    const worker = new Worker(resolvedPath, { workerData });
    worker.on("error", (error) => {
      console.error(`Worker error: ${error.message}`);
    });
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
      console.log(`Worker terminated`);
    });
    const terminate = () => {
      try {
        worker.removeAllListeners();
        worker.terminate();
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to terminate worker: ${error.message}`);
        } else {
          console.error(`Failed to terminate worker: ${error}`);
          console.error("[addThread - app]: Unknown error: ", error);
        }
      }
    };
    this.backgroundTasks.push(terminate);
    return [worker, terminate];
  }
  /**
   * -------------------------------------------------------
   * Deskthing Server Functions
   */
  /**
   * Fetches the manifest
   * @returns Manifest | null
   */
  loadManifest() {
    if (this.manifest) {
      return this.manifest;
    }
    const builtManifestPath = path.resolve(
      process.env.DESKTHING_ROOT_PATH || __dirname,
      "../manifest.json"
    );
    const devManifestPath = path.resolve(
      process.env.DESKTHING_ROOT_PATH || __dirname,
      "../deskthing/manifest.json"
    );
    console.log(devManifestPath);
    const oldBuiltManifestPath = path.resolve(
      process.env.DESKTHING_ROOT_PATH || __dirname,
      "./manifest.json"
    );
    const oldDevManifestPath = path.resolve(
      process.env.DESKTHING_ROOT_PATH || __dirname,
      "../public/manifest.json"
    );
    const errors = [];
    if (fs.existsSync(builtManifestPath)) {
      try {
        const manifestData = fs.readFileSync(builtManifestPath, "utf-8");
        this.manifest = JSON.parse(manifestData);
        return this.manifest;
      } catch (error) {
        console.error("Failed to load built manifest:");
        errors.push(error);
      }
    }
    if (fs.existsSync(devManifestPath)) {
      try {
        const manifestData = fs.readFileSync(devManifestPath, "utf-8");
        this.manifest = JSON.parse(manifestData);
        return this.manifest;
      } catch (error) {
        console.error("Failed to load dev manifest:");
        errors.push(error);
      }
    }
    if (fs.existsSync(oldBuiltManifestPath)) {
      try {
        const manifestData = fs.readFileSync(oldBuiltManifestPath, "utf-8");
        this.manifest = JSON.parse(manifestData);
        return this.manifest;
      } catch (error) {
        console.error("Failed to load old built manifest:");
        errors.push(error);
      }
    }
    if (fs.existsSync(oldDevManifestPath)) {
      try {
        const manifestData = fs.readFileSync(oldDevManifestPath, "utf-8");
        this.manifest = JSON.parse(manifestData);
        return this.manifest;
      } catch (error) {
        console.error("Failed to load old dev manifest:");
        errors.push(error);
      }
    }
    console.error(
      "[loadManifest] Failed to load manifest from any location:",
      errors
    );
    console.log("[loadManifest]: Manifest not found in any location");
    return null;
  }
  /**
   * Returns the manifest in a Response structure
   * If the manifest is not found or fails to load, it returns a 500 status code.
   * It will attempt to read the manifest from file if the manifest does not exist in cache
   *
   * !! This method is not intended for use in client code.
   *
   * @example
   * const manifest = deskThing.getManifest();
   * console.log(manifest);
   */
  getManifest() {
    if (!this.manifest) {
      this.loadManifest();
      if (!this.manifest) {
        return;
      } else {
      }
    }
    return this.manifest;
  }
  /**
   * @returns
   */
  async purge() {
    try {
      await this.notifyListeners(DESKTHING_EVENTS2.PURGE, {
        type: DESKTHING_EVENTS2.PURGE,
        request: void 0
      });
      this.stopRequested = true;
      this.backgroundTasks.forEach((cancel) => cancel());
      console.log("Background tasks stopped");
      this.clearCache();
      console.log("Cache cleared");
    } catch (error) {
      console.error("Error in Purge:", error);
      return {
        data: { message: `Error in Purge: ${error}` },
        status: 500,
        statusText: "Internal Server Error",
        request: []
      };
    }
    return {
      data: { message: "App purged successfully!" },
      status: 200,
      statusText: "OK",
      request: []
    };
  }
  // Method to clear cached data
  clearCache() {
    this.Listeners = {};
    this.manifest = null;
    this.stopRequested = false;
    this.backgroundTasks = [];
    this.sysListeners.forEach((removeListener) => removeListener());
    this.sysListeners = [];
    Promise.all(
      Object.entries(this.imageUrls).map(async ([url2, id]) => {
        try {
          const imagePath = path.join(__dirname, id);
          await fs.promises.unlink(imagePath);
          delete this.imageUrls[url2];
        } catch (err) {
          console.warn(`Failed to delete image ${id}:`, err);
        }
      })
    );
    console.log("Cache cleared");
  }
  /**
   * @returns
   */
  async handleServerMessage(data) {
    try {
      if (!data) return;
      if (process.env.DESKTHING_ENV == "development") {
      }
      switch (data.type) {
        case DESKTHING_EVENTS2.APPDATA:
          try {
            if (!data.payload) throw new Error("No data payload");
            isValidAppDataInterface(data.payload);
            this.saveAppData(data.payload, false);
          } catch (error) {
            console.log("Received invalid data from server");
            console.error("Invalid app data interface:", error);
            console.debug("Data Received: " + JSON.stringify(data));
            return;
          }
          break;
        case DESKTHING_EVENTS2.DATA:
          if (data.payload) {
            this.saveData(data.payload, false);
          }
          break;
        case DESKTHING_EVENTS2.MESSAGE:
          console.log("Received message from server:" + data.payload);
          break;
        case DESKTHING_EVENTS2.SETTINGS:
          console.debug("Received settings from server:", data.payload);
          if (!data.payload) {
            console.log("Received invalid settings from server:", data);
          } else {
            const settings = data.payload;
            this.notifyListeners(DESKTHING_EVENTS2.SETTINGS, {
              type: DESKTHING_EVENTS2.SETTINGS,
              payload: settings
            });
          }
          break;
        default:
          this.notifyListeners(data.type, data);
          break;
      }
    } catch (error) {
      console.error(
        "Encountered an error in toClient" + (error instanceof Error ? error.message : error)
      );
    }
  }
};
function createDeskThing() {
  return DeskThingClass.getInstance();
}
var DeskThing = DeskThingClass.getInstance();

// server/weather.ts
var import_openmeteo = __toESM(require_lib(), 1);

// server/weatherUtils.ts
var url = "https://api.open-meteo.com/v1/forecast";
var range = (start2, stop2, step) => Array.from({ length: (stop2 - start2) / step }, (_, i) => start2 + i * step);

// server/weather.ts
var DeskThing2 = createDeskThing();
var WeatherService = class _WeatherService {
  weatherData;
  lastUpdateTime;
  updateTaskId = null;
  static instance = null;
  speed_unit = "mph";
  temp_unit = "f";
  longitude = "0";
  latitude = "0";
  constructor() {
    this.updateWeather();
    this.scheduleHourlyUpdates();
  }
  static getInstance() {
    if (!_WeatherService.instance) {
      _WeatherService.instance = new _WeatherService();
    }
    return _WeatherService.instance;
  }
  async updateWeather() {
    console.debug("Updating weather data...");
    if (!this.latitude || !this.longitude || this.latitude == "0" || this.longitude == "0") {
      console.warn("No latitude or longitude set! Not updating weather data");
      return;
    }
    console.debug("Updating weather data...");
    const params = {
      latitude: this.latitude,
      longitude: this.longitude,
      hourly: [
        "temperature_2m",
        "relative_humidity_2m",
        "dew_point_2m",
        "apparent_temperature",
        "precipitation_probability",
        "precipitation",
        "rain",
        "showers",
        "snowfall",
        "snow_depth",
        "cloud_cover",
        "visibility",
        "wind_speed_10m",
        "wind_direction_10m",
        "uv_index"
      ],
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "rain",
        "cloud_cover",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m"
      ],
      daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_mean"
      ],
      temperature_unit: this.temp_unit == "f" ? "fahrenheit" : "celsius",
      wind_speed_unit: this.speed_unit == "mph" ? "mph" : "kmh",
      timeformat: "unixtime",
      forecast_days: 1,
      models: "best_match"
    };
    const url2 = url;
    console.log(
      `Fetching weather data from OpenMeteo API with params: ${JSON.stringify(
        params
      )}`
    );
    const responses = await (0, import_openmeteo.fetchWeatherApi)(url2, params);
    const response = responses[0];
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const hourly = response.hourly();
    const current = response.current();
    const daily = response.daily();
    const utcOffsetSeconds = response.utcOffsetSeconds();
    console.log(`Weather data received from OpenMeteo API.`);
    this.weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) => new Date((t + response.utcOffsetSeconds()) * 1e3)),
        temperature2m: hourly.variables(0).valuesArray(),
        relativeHumidity2m: hourly.variables(1).valuesArray(),
        dewPoint2m: hourly.variables(2).valuesArray(),
        apparentTemperature: hourly.variables(3).valuesArray(),
        precipitationProbability: hourly.variables(4).valuesArray(),
        precipitation: hourly.variables(5).valuesArray(),
        rain: hourly.variables(6).valuesArray(),
        showers: hourly.variables(7).valuesArray(),
        snowfall: hourly.variables(8).valuesArray(),
        snowDepth: hourly.variables(9).valuesArray(),
        cloudCover: hourly.variables(10).valuesArray(),
        visibility: hourly.variables(11).valuesArray(),
        windSpeed10m: hourly.variables(12).valuesArray(),
        windDirection10m: hourly.variables(13).valuesArray(),
        uvIndex: hourly.variables(14).valuesArray()
      },
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1e3),
        temperature2m: current.variables(0).value(),
        relativeHumidity2m: current.variables(1).value(),
        apparentTemperature: current.variables(2).value(),
        isDay: current.variables(3).value(),
        precipitation: current.variables(4).value(),
        rain: current.variables(5).value(),
        cloudCover: current.variables(6).value(),
        windSpeed10m: current.variables(7).value(),
        windDirection10m: current.variables(8).value(),
        windGusts10m: current.variables(9).value()
      },
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1e3)),
        temperature2mMax: daily.variables(0).valuesArray(),
        temperature2mMin: daily.variables(1).valuesArray(),
        precipitationProbabilityMean: daily.variables(2).valuesArray()
      },
      tempUnit: this.temp_unit,
      speedUnit: this.speed_unit,
      longitude: this.longitude,
      latitude: this.latitude
    };
    this.lastUpdateTime = /* @__PURE__ */ new Date();
    console.log("Weather updated");
    DeskThing2.send({ type: "weather_data", payload: this.weatherData });
  }
  scheduleHourlyUpdates() {
    if (this.updateTaskId) {
      this.updateTaskId();
    }
    this.updateTaskId = DeskThing2.addBackgroundTaskLoop(async () => {
      this.updateWeather();
      await this.sleep(15 * 60 * 1e3);
    });
  }
  sleep(ms) {
    return new Promise((resolve2) => setTimeout(resolve2, ms));
  }
  updateData(data) {
    if (!data) {
      console.log("No settings defined");
      return;
    }
    try {
      console.log("Updating settings");
      const new_speed_unit = data.speed_unit.value || "mph";
      const new_temp_unit = data.temp_unit.value || "f";
      const new_longitude = data.longitude.value || "0";
      const new_latitude = data.latitude.value || "0";
      const changes = new_speed_unit !== this.speed_unit || new_temp_unit !== this.temp_unit || new_longitude !== this.longitude || new_latitude !== this.latitude;
      this.speed_unit = new_speed_unit;
      this.temp_unit = new_temp_unit;
      this.longitude = new_longitude;
      this.latitude = new_latitude;
      if (changes) {
        console.debug(
          `New values for weather data: ${this.speed_unit}, ${this.temp_unit}, ${this.longitude}, ${this.latitude}`
        );
        this.updateWeather();
      } else {
        console.debug(
          `No settings changed: ${this.speed_unit}, ${this.temp_unit}, ${this.longitude}, ${this.latitude}`
        );
      }
    } catch (error) {
      console.log("Error updating weather data: " + error);
    }
  }
  async stop() {
    this.lastUpdateTime = null;
  }
  async getWeather() {
    if (!this.lastUpdateTime || (/* @__PURE__ */ new Date()).getTime() - this.lastUpdateTime.getTime() > 15 * 60 * 1e3) {
      console.log("Fetching weather data...");
      await this.updateWeather();
    } else {
      console.log("Returning cached weather data");
    }
    console.log("Returning weather data");
    return this.weatherData;
  }
};
var weather_default = WeatherService.getInstance();

// server/index.ts
var DeskThing3 = createDeskThing();
var start = async () => {
  await setupSettings();
};
DeskThing3.on("get" /* GET */, async (request) => {
  if (request.request === "weather_data") {
    console.log("Getting weather data");
    const weatherData = await weather_default.getWeather();
    if (weatherData) {
      DeskThing3.send({ type: "weather_data", payload: weatherData });
    } else {
      console.log("Error getting weather data");
    }
  }
});
DeskThing3.on(DESKTHING_EVENTS.SETTINGS, (settings) => {
  if (settings) {
    console.debug("Settings updating");
    weather_default.updateData(settings.payload);
  }
});
var setupSettings = async () => {
  let latitude = 0, longitude = 0;
  try {
    const response = await fetch("http://ip-api.com/json/?fields=lat,lon");
    if (!response.ok) {
      throw new Error(response.statusText);
    } else {
      const { lat, lon } = await response.json();
      latitude = lat;
      longitude = lon;
      console.debug(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }
  } catch (error) {
    console.warn("Error getting location: " + (error instanceof Error ? error.message : error));
  }
  const settings = {
    background_color: {
      label: "Background Color",
      id: "background_color",
      value: "#1e293b",
      description: "Set the background color using a hex value (e.g., #1e293b for dark slate)",
      type: SETTING_TYPES.STRING
    },
    temp_unit: {
      label: "Temperature Unit",
      id: "temp_unit",
      value: "f",
      type: SETTING_TYPES.SELECT,
      options: [
        { label: "Fahrenheit", value: "f" },
        { label: "Celsius", value: "c" }
      ]
    },
    speed_unit: {
      label: "Wind Speed Unit",
      id: "speed_unit",
      value: "mph",
      placeholder: "mph",
      type: SETTING_TYPES.SELECT,
      options: [
        { label: "Miles Per Hour", value: "mph" },
        { label: "Kilometers Per Hour", value: "kmh" }
      ]
    },
    latitude: {
      label: "Latitude",
      id: "latitude",
      value: latitude,
      description: "The latitude of the location you want to get weather data for. Can be found on google maps.",
      type: SETTING_TYPES.NUMBER,
      min: -180,
      max: 180
    },
    longitude: {
      label: "Longitude",
      id: "longitude",
      description: "The longitude of the location you want to get weather data for. Can be found on google maps.",
      value: longitude,
      type: SETTING_TYPES.NUMBER,
      min: -180,
      max: 180
    }
  };
  await DeskThing3.initSettings(settings);
};
var stop = async () => {
  weather_default.stop();
};
DeskThing3.on(DESKTHING_EVENTS.STOP, stop);
DeskThing3.on(DESKTHING_EVENTS.START, start);
//# sourceMappingURL=index.js.map
