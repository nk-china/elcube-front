/*
 * 	This file is part of ELCube.
 *	ELCube is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCube is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
 */
import {mapGetters} from "vuex";

export default ()=>{

  return {
    props: {
      editMode:Boolean,
      createMode:Boolean,
      doc:Object,
      card:Object
    },
    data(){
      return {
        pager:{
          current: 1,
          size: 10,
        }
      }
    },
    created() {
    },
    computed:{
      ...mapGetters('User',[
        'user'
      ]),
      def(){
        return this.card.config;
      },
      data:{
        get(){
          return this.doc.data[this.card.cardKey];
        },
        set(value){
          this.doc.data[this.card.cardKey] = value;
        }
      },
      pagedData(){
        if(this.data instanceof Array){
          const start = (this.pager.current-1)*this.pager.size;
          return this.data.slice(start,start+this.pager.size);
        }
        return [];
      }
    },
    methods:{
      nk$call(options){
        return new Promise((resolve,reject)=>{
          this.$http.postJSON(
              `/api/doc/call`,
              {doc:this.doc,fromCard:this.card.cardKey,options}
              )
              .then(response=>{
                resolve(response.data);
              })
              .catch(reject)
              .finally((e)=>{
                reject(e);
              })
        })
      },
      nk$calc(options){
        this.$emit("nk-calc",options);
      }
    }
  };
}
