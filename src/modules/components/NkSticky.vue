<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <div :style="{height:style.height,zIndex:style.zIndex}">
        <div
            :class="className"
            :style="{
                top: style.top,
                zIndex: style.zIndex,
                position: style.position,
                width: style.width,
                height: style.height,
                background: style.background
            }"
        >
            <slot v-if="active"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'sticky',
    props: {
        isRem: {
            type: Boolean,
            default: false
        },
        stickyTop: {
            type: Number,
            default: 0
        },
        zIndex: {
            type: Number,
            default: 100
        },
        className: {
            type: String,
            default: ''
        },
        background: {
            type: String,
            default: ''
        },
        viewport: {
            type: Number,
            default: 750
        },
        remBase: {
            type: Number,
            default: 75
        }
    },
    computed: {
        ratio() {
            return this.viewport / window.screen.width
        },
        style() {
            let {
                //height,
                zIndex,
                //ratio,
                isSticky,
                stickyTop,
                position,
                width,
                background
            } = this
            const s = {
                height: 0,//this.getRemStyle((height * ratio)),
                zIndex: zIndex,
                top: isSticky ? this.getRemStyle(stickyTop) : '',
                position:position,
                width: width,
                background: background
            }
            return s
        }
    },
    data() {
        return {
            active: false,
            position: '',
            width: undefined,
            height: undefined,
            isSticky: false
        }
    },
    mounted() {
        this.height = this.$el.getBoundingClientRect().height
        window.addEventListener('scroll', this.handleScroll)
        window.addEventListener('resize', this.handleResize)
    },
    activated() {
        this.handleScroll()
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
        window.removeEventListener('resize', this.handleResize)
    },
    methods: {
        getRemStyle(t) {
            return this.isRem ? t / this.remBase + 'rem' : t + 'px'
        },
        sticky() {
            if (this.active) {
                return
            }
            this.position = 'fixed';
            this.active = true
            this.width = this.width + 'px'
            this.isSticky = true
            this.height = '50px';
            this.$emit('changed',true);
        },
        handleReset() {
            if (!this.active) {
                return
            }
            this.reset()
        },
        reset() {
            this.position = ''
            this.width = 'auto'
            this.active = false
            this.isSticky = false
            this.height = '0';
            this.$emit('changed',false);
        },
        handleScroll() {
            const width = this.$el.getBoundingClientRect().width
            this.width = width || 'auto'
            const offsetTop = this.$el.getBoundingClientRect().top
            if (offsetTop < (this.isRem ? this.stickyTop / this.ratio : this.stickyTop)) {
                this.sticky()
                return
            }
            this.handleReset()
        },
        handleResize() {
            if (this.isSticky) {
                this.width = this.$el.getBoundingClientRect().width + 'px'
            }
        }
    }
}
</script>
