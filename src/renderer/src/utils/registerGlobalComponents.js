import PageHeader from '@renderer/components/Library/PageHeader.vue';
import PageContent from '@renderer/components/Library/PageContent.vue';
import PageControls from '@renderer/components/Library/PageControls.vue';
import SectionHeader from '@renderer/components/Library/SectionHeader.vue';
import FileSelector from '@renderer/components/Library/FileSelector.vue';
import EmptyState from '@renderer/components/Library/EmptyState.vue';
import Image from '@renderer/components/Library/Image.vue';
import Input from '@renderer/components/Library/Forms/Input.vue';
import FieldLabel from '@renderer/components/Library/Forms/FieldLabel.vue';
import ExaiButton from '@renderer/components/Library/ExaiButton.vue';

const registerGlobalComponents = (App) => {
    App.component('page-header', PageHeader);
    App.component('page-content', PageContent);
    App.component('page-controls', PageControls);
    App.component('section-header', SectionHeader);
    App.component('empty-state', EmptyState);
    App.component('global-image', Image);
    App.component('form-input', Input);
    App.component('field-label', FieldLabel);
    App.component('file-selector', FileSelector);
    App.component('exai-button', ExaiButton);
}

export default registerGlobalComponents;
