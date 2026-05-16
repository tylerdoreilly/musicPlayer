import PageHeader from '@renderer/components/Library/PageHeader.vue';
import PageContent from '@renderer/components/Library/PageContent.vue';
import PageControls from '@renderer/components/Library/PageControls.vue';
import EmptyState from '@renderer/components/Library/EmptyState.vue';
import Image from '@renderer/components/Library/Image.vue';
import Input from '@renderer/components/Library/Forms/Input.vue';

const registerGlobalComponents = (App) => {
    App.component('page-header', PageHeader);
    App.component('page-content', PageContent);
    App.component('page-controls', PageControls);
    App.component('empty-state', EmptyState);
    App.component('global-image', Image);
    App.component('form-input', Input);
}

export default registerGlobalComponents;
