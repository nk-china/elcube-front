/*
 * 	This file is part of ELCard.
 *	ELCard is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCard is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
 */

import {atob} from 'js-base64';
import pako from 'pako'

function Buffer(array){

    let out, i, len, c;
    let char2, char3;

    out = '';
    len = array.length;
    i = 0;
    while(i < len) {
        c = array[i++];
        switch(c >> 4){
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return {
        toString(){
            return out;
        }
    }
}

function uncompress(str) {

    let arrayGzip = new Uint8Array(atob(str).split('').map(x => x.charCodeAt(0)));
    let arrayUnGzip = pako.ungzip(arrayGzip);
    let buffer = new Buffer(arrayUnGzip);

    return buffer.toString();
}

export default {Buffer,uncompress};