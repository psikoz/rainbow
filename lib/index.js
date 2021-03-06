const decRegExp = /^((\d{1,2}|1\d{2}|2[0-5]{2})[,\s]){2}(\d{1,2}|1\d{2}|2[0-5]{2})$/;
const hexRegExp = /^#?([a-f\d]{3}|[a-f\d]{6})$/i;

/**
 * Transform Hex color to dec array like [12,34,255]
 * @param {string} val Hex color like #ff00ff
 * @returns {number[]}
 */
function transformHexString(val) {
  val = val.replace('#', '');

  if(val.length===3){
    val=val+val;
  }

  let hexArr = [val.substring(0, 2), val.substring(2, 4), val.substring(4, 6)];

  return hexArr.map(item => parseInt(item, 16));
}

/**
 * Transform Dec color string to dec array like [12,34,255]
 * @param {string} val Hex color like 123,23,34
 * @returns {number[]}
 */
function transformDecString(val) {
  return val.split(/,|\s/).map(val => parseInt(val, 10));
}

function isNumber(val) {
  return typeof val === 'number' && !isNaN(val);
}

function isValidPercent(val) {
  return isNumber(val) && val <= 1 && val >= 0;
}

export class Rainbow {
  /**
   *
   * @param {string} val Hex color
   */
  static isHex(val) {
    return hexRegExp.test(val);
  }

  /**
   *
   * @param {string} val Rgb color like 158,128,255
   */
  static isDec(val) {
    return decRegExp.test(val);
  }

  /**
   * transform rgb to hex
   * @param {string} val 
   * @returns {string}
   */
  static rgb2hex(val){
    return new this(val).toHex();
  }

  /**
   * transform hex to rgb
   * @param {string} val 
   * @returns {string}
   */
  static hex2rgb(val){
    return new this(val).toDec();
  }
  /**
   * Create a rainbow instance
   * @param {string} color Hex color or Dec color
   */
  constructor(color) {
    this._primitiveValue_ = color;
    this._init_(color);
  }
  _init_(color) {
    if (Rainbow.isHex(color)) {
      this._rgb_ = transformHexString(color);
    } else if (Rainbow.isDec(color)) {
      this._rgb_ = transformDecString(color);
    } else {
      throw new Error(`[Rainbow] Argument ${color} is not a valid color.`);
    }
  }
  reset() {
    this._init_(this._primitiveValue_);
    return this;
  }
  /**
   * lighten color
   * @param {number} percent 0-1
   * @returns{Rainbow}
   */
  lighten(percent = 0) {
    let newval=percent=parseFloat(percent);

    if(!isValidPercent(newval))throw new Error(`[Rainbow] Argument ${percent} is not a valid number.`);

    this._rgb_ = this._rgb_.map(val => {
      if (val === 0) {
        return 10;
      }
      let result = parseInt(val * newval + val);
      return result > 255 ? 255 : result;
    });
    return this;
  }

  /**
   * darken color
   * @param {number} percent 0-1
   * @returns{Rainbow}
   */
  darken(percent = 0) {
    let newval=parseFloat(percent);
    
    if(!isValidPercent(newval))throw new Error(`[Rainbow] Argument ${percent} is not a valid number.`);

    this._rgb_ = this._rgb_.map(val => {
      let result = parseInt(val - val * newval);
      return result < 0 ? 0 : result;
    });
    return this;
  }

  accent() {
    this._rgb_ = this._rgb_.map(val => 255 - val);
    return this;
  }
  /**
   * to dec rgb value
   * @returns {string}
   */
  toDec() {
    return `rgb(${this._rgb_.join(',')})`;
  }
  
  /**
   * transform to rgba
   * @param {number} alpha alpha channel
   */
  toRGBA(alpha){
    return `rgba(${this._rgb_.join(',')},${alpha})`;
  }
  /**
   * to hex rgb value
   * @returns {string}
   */
  toHex() {
    let temp = this._rgb_.map(val => {
      let newval = new Number(val).toString(16);
      return val < 16 ? '0' + newval : newval;
    });
    return '#' + temp.join('');
  }

  toString(){
    return this._primitiveValue_;
  }

  /**
   * add another color
   * @param {string|Rainbox} color 
   */
  add(color){
    if(!(color instanceof Rainbow)){
      color=new Rainbow(color);
    }

    this._rgb_=this._rgb_.map((val,i)=>{
      let result=val+color._rgb_[i];
      return result>255?255:result;
    });

    return this;
  }
}

export default Rainbow;
