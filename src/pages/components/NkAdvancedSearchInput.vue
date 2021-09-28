<template>
  <div>
    <div ref="layout" class="nk-advanced-layout" aria-haspopup="true" role="combobox" @click="layoutFocus">

      <template v-for="(item,index) in list">
        <div :key="index" v-if="!item.break" class="i item" tabindex="0" @focus="item.focus = true" @blur="item.focus = false">
          <div>
            <label>{{item.key}}</label>
            <a-input-group compact size="small" style="display: flex">

              <a-select size="small" default-value="=" :dropdownMatchSelectWidth="false" v-model="item.symbol" class="symbol">
                <span slot="suffixIcon"></span>
                <a-select-option v-for="i in
                  (item.dataType === 'text' ? ['=','in','not in','contains','starts with','ends with']
                                            : ['=','>','>=','<','<=','between'])
                " :key="i">{{ i }}</a-select-option>
              </a-select>

              <template v-if="item.dataType==='date'">
                <a-range-picker v-if="item.symbol==='between'" size="small" class="ii"/>
                <a-date-picker  v-else                         size="small" class="ii"/>
              </template>
              <template v-else-if="item.dataType==='number'">
                <template v-if="item.symbol==='between'">
                  <a-input-number                              size="small" class="ii" style="width: 90px;" />
                  <a-input                                     size="small" class="ii" style="width: 30px; pointer-events: none; background-color: #fff" placeholder="~" disabled />
                  <a-input-number                              size="small" class="ii" style="width: 90px;" />
                </template>
                <a-input-number v-else                         size="small" class="ii" style=""/>
              </template>
              <template v-else>
                <a-select v-if="item.symbol==='in'
                             || item.symbol==='not in'"        size="small" class="ii" style="min-width: 120px;" mode="tags" :maxTagCount="3"></a-select>
                <a-input  v-else                               size="small" class="ii" style="width: 120px;"/>
              </template>

            </a-input-group>
            <a-icon type="close" class="close" @click="removeItem(index)" />
          </div>


        </div>
        <div :key="index" v-else class="or item">
          <div class="l"></div><span>or</span><div class="l" style="width: 100%"></div>
        </div>
      </template>

      <div class="input item">
        <input ref="input" @keydown="inputKeydown" @keyup="inputKeyup" @click="layoutFocus" />
        <span ref="input_mirror">{{inputValue}}&nbsp;</span>
        <div ref="dropdown" class="dropdown" v-if="focus" :style="{left:(left-5)+'px'}">
          <div>
            <ul v-if="filteredOptions.length">
              <li v-for="(item,index) in filteredOptions" :key="item" @mouseenter="dropdownHover(index)" @click="dropdownSelect(item)" :class="{hover:index===optionSelectedIndex}">{{item}}</li>
            </ul>
            <nk-empty v-else style="padding: 20px 0;"></nk-empty>
          </div>
        </div>
      </div>
    </div>

    <div class="aaa" v-if="focus" @click="inputBlur"></div>

  </div>
</template>

<script>
export default {
  data(){
    return {
      focus:false,
      inputValue: '',
      list:[{
        key: "姓名",
        symbol:'=',
        dataType:'text'
      },{
        key: "年龄",
        symbol:'=',
        dataType:'number'
      },{
        key: "日期",
        symbol:'=',
        dataType:'date'
      }],
      options:["or","姓名","地址","电话","资产","等级","姓名1","地址1","电话1","资产1","等级1"],
      optionSelectedIndex: 0
    }
  },
  computed:{
    filteredOptions(){
      return this.options.filter(i=>i.indexOf(this.inputValue)>=0);
    }
  },
  methods:{
    layoutFocus(e){
      if(this.focus===false && (e===true||e.target===this.$refs.layout||e.target===this.$refs.input)){
        this.$refs.input.focus();
        this.optionSelectedIndex=0;
        this.focus = true;
        this.left  = this.$refs.input.getBoundingClientRect().x;
      }
    },
    inputKeydown(e){
      if(e.key==='Backspace'){
        if(this.inputValue.trim()==='' && this.list.length){
          this.list.splice(this.list.length-1,1);
        }
      }else if(e.key==='ArrowUp'){
        this.optionSelectedIndex--;
        if(this.optionSelectedIndex===-1){
          this.optionSelectedIndex=this.options.length-1;
        }
      }else if(e.key==='ArrowDown'){
        this.optionSelectedIndex++;
        if(this.optionSelectedIndex>=this.options.length){
          this.optionSelectedIndex=0;
        }
      }else if(e.key==='Escape'){
        this.inputValue='';
        this.$refs.input.value='';
        this.$refs.input.blur();
        this.inputBlur();
      }else{
        this.inputValue = this.$refs.input.value;
      }
    },
    inputKeyup(e){
      this.inputValue = this.$refs.input.value;
      switch (e.key){
        case 'Enter':
          this.inputValue = this.filteredOptions[this.optionSelectedIndex]||'';
          this.$refs.input.value = this.inputValue;
          this.inputBlur();
          setTimeout(()=>{
            this.layoutFocus(true);
          },100)
          break;
        default:
          break;
      }
    },
    inputBlur(){
      this.focus = false;
      if((this.inputValue=this.inputValue.trim())){

        if(this.inputValue==='or'){
          this.list.push({
            key:this.inputValue,
            break:true
          });
        }else if(this.filteredOptions.indexOf(this.inputValue)>=0){

          let dataType = 'text';

          if(this.inputValue.endsWith('_date')){
            dataType = 'date';
          }else if(this.inputValue.endsWith('_int')||this.inputValue.endsWith('_long')||this.inputValue.endsWith('_float')||this.inputValue.endsWith('_double')){
            dataType = 'number';
          }

          this.list.push({
            key:this.inputValue,
            symbol:'=',
            dataType
          });
        }
        this.inputValue='';
        this.$refs.input.value = '';
      }
    },
    dropdownSelect(e){
      this.inputValue = e+'';
      this.inputBlur();
    },
    dropdownHover(e){
      this.optionSelectedIndex=e;
    },
    removeItem(index){
      this.list.splice(index,1);
    }
  }
}
</script>

<style scoped lang="less">
  .aaa{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    opacity: 0;
  }
  .nk-advanced-layout{
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background-color: #fff;
    line-height: 20px;
    font-size: 12px;
    padding: 0 5px 5px;
    position: relative;

    .item{
      margin-top: 5px;
    }

    .input{
      position: relative;
      display: inline-block;

      input{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        right: 0;
        border: none;
        outline: none;
        z-index: 11;
      }

      span{
        position: relative;
        left: 0;
        top: 0;
        opacity: 0;
        padding-right: 1em;
        white-space:pre;
        pointer-events:none;
      }

      .dropdown{
        position: fixed;
        z-index: 11;
        left: -5px;
        padding: 5px;

        & > div{
          min-width: 140px;
          background-color:#fff;
          border-radius:4px;
          box-shadow: 0 2px 8px #ccc;
          max-height: 280px;
          overflow-y: auto;
        }

        ul{
          margin: 0;
          padding: 5px 0;

          li{
            list-style: none;
            padding: 5px 10px;
            margin: 0;

            &.hover,&:hover{
              background-color: #e6f7ff;
            }
          }
        }
      }
    }

    div.i{
      position: relative;
      border: 1px solid #e8e8e8;
      border-radius: 2px;
      background-color: #fafafa;
      display: inline-block;
      padding: 5px 20px 5px 10px;
      margin-right: 4px;
      user-select:none;
      ::v-deep.ant-input-group-compact{
        .symbol{
          .ant-select-selection__rendered{
            margin-left:  10px;
            margin-right: 10px;
          }
          .ant-select-arrow{
            display: none;
          }
        }
        .ii{
          .ant-input,.ant-select-selection{
            border-left-width: 0;
          }
        }
      }


      & > div{
        display: flex;
        align-items: center;

        & > label{
          display: block;
          word-break: keep-all;
          white-space:nowrap;
          padding-right: 5px;

          &::after{
            //content: ":";
          }
        }
      }
    }
    div.or{
      display: flex;
      align-items: center;
      .l{
        border-top: 1px #e9e9e9 dashed;
        width: 60px;
      }
      span{
        padding: 0 12px;
        font-weight: 600;
        font-size: 1.1em;
      }
    }
  }

  .close{
    position: relative;left: 10px;width: 10px;font-size: 10px;
    color: rgba(0, 0, 0, 0.45);

    &:hover{
      color: rgba(0, 0, 0, 0.75);
    }
  }

</style>