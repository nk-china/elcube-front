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
/**
 * 基本的Vue组件
 */

import NkLogo from "./NkLogo";
import NkLoginForm from "./NkLoginForm";
import NkEditSlot from "./NkEditSlot";
import NkForm from "./NkForm";
import NkPageLayout from "./layout/NkPageLayout";
import NkQueryLayout from "./layout/NkQueryLayout";
import NkScriptEditor from "./NkScriptEditor";
import NkSearchBox from "./NkSearchBox";
import NkSearchItem from "./NkSearchItem";
import NkSearchMore from "./NkSearchMore";
import NkSearchOptionsDateRange from "./NkSearchOptionsDateRange";
import NkSearchOptionsMultiple from "./NkSearchOptionsMultiple";
import NkSearchOptionsNumberRange from "./NkSearchOptionsNumberRange";
import NkSearchOptionsSingle from "./NkSearchOptionsSingle";
import NkSearchOptionsText from "./NkSearchOptionsText";
import NkSearchOptionsSuggest from "./NkSearchOptionsSuggest";
import NkVxeInput from "./NkVxeInput";
import NkVxeSelect from "./NkVxeSelect";
import NkDocLink from "./NkDocLink";
import NkCardHelpLink from "./NkCardHelpLink";
import NkRequiredMark from "./NkRequiredMark";
import NkDocException from "./NkDocException";
import NkEmpty from "./NkEmpty";
import NkMeter from "./NkMeter";
import VueHighlight from "./vue-highlight";
import 'highlight.js/styles/github.css';

function install(Vue){
  Vue.component("nk-logo", NkLogo);
  Vue.component("NkLoginForm", NkLoginForm);
  Vue.component("nk-required-mark", NkRequiredMark);
  Vue.component("nk-empty", NkEmpty);

  Vue.component("nk-edit-slot", NkEditSlot);

  Vue.component("nk-form", NkForm);
  Vue.component("nk-form-item", NkForm.Item[0]);
  Vue.component("nk-form-divider", NkForm.Item[1]);

  Vue.component("nk-page-layout", NkPageLayout);
  Vue.component("nk-query-layout", NkQueryLayout);
  Vue.component("nk-script-editor",NkScriptEditor);
  Vue.component("nk-search-box", NkSearchBox);
  Vue.component("nk-search-item", NkSearchItem);
  Vue.component("nk-search-more", NkSearchMore);

  Vue.component("nk-search-options-date-range", NkSearchOptionsDateRange);
  Vue.component("nk-search-options-multiple", NkSearchOptionsMultiple);
  Vue.component("nk-search-options-number-range", NkSearchOptionsNumberRange);
  Vue.component("nk-search-options-single", NkSearchOptionsSingle);
  Vue.component("nk-search-options-text", NkSearchOptionsText);
  Vue.component("nk-search-options-suggest", NkSearchOptionsSuggest);

  Vue.component("nk-vxe-input",NkVxeInput);
  Vue.component("nk-vxe-select",NkVxeSelect);

  Vue.component("nk-doc-link",NkDocLink);

  Vue.component("nk-help-link",NkCardHelpLink);

  Vue.component("NkDashboardCard",NkMeter);
  Vue.component("nk-meter",NkMeter);

  Vue.component("NkDocException",NkDocException);

  Vue.use(VueHighlight);
}
export default {install}
