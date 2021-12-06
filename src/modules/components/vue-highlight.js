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
import hljs from 'highlight.js/lib/common';

function hasValueOrEmptyAttribute(value) {
    return Boolean(value || value === "");
}

function escapeHTML(value) {
    return value && value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

const Component = {
    props: ["language", "code", "autodetect"],
    data: function() {
        return {
            detectedLanguage: "",
            unknownLanguage: false
        };
    },
    computed: {
        className() {
            if (this.unknownLanguage) return "";
            return "hljs " + this.detectedLanguage;
        },
        highlighted() {
            // no idea what language to use, return raw code
            if (!this.autoDetect && !hljs.getLanguage(this.language)) {
                console.warn(`The language "${this.language}" you specified could not be found.`);
                this.unknownLanguage = true;
                return escapeHTML(this.code);
            }

            let result = {};
            if (this.autoDetect) {
                result = hljs.highlightAuto(this.code);
                this.detectedLanguage = result.language;
            } else {
                result = hljs.highlight(this.code, { language: this.language, ignoreIllegals: this.ignoreIllegals });
                this.detectedLanguage = this.language;
            }
            return result.value;
        },
        autoDetect() {
            return !this.language || hasValueOrEmptyAttribute(this.autodetect);
        },
        ignoreIllegals() {
            return true;
        }
    },
    // this avoids needing to use a whole Vue compilation pipeline just
    // to build Highlight.js
    render(createElement) {
        return createElement("pre", {}, [
            createElement("code", {
                class: this.className,
                domProps: { innerHTML: this.highlighted }
            })
        ]);
    }
    // template: `<pre><code :class="className" v-html="highlighted"></code></pre>`
};

export default {
    install(Vue) {
        Vue.component('highlightjs', Component);
    },
    component: Component
};

