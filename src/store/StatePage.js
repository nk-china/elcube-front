/**
 * 暂时没用上
 */

export default {
  namespaced: true,
  state: {
    data:{}
  },
  mutations: {
    increment(state,key){
      state.data[key]=new Date().getTime();
    },
    reset(state,key){
      let changed = state.data[key];
      state.data[key] = false;
      return changed;
    }
  },
  actions: {
  },
  getters: {
    changed: (state) => (key) => {
      return state.data[key];
    }
  }
}
