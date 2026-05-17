import PageHeader from '@renderer/components/Library/PageHeader.vue';
import PageContent from '@renderer/components/Library/PageContent.vue';
import PageControls from '@renderer/components/Library/PageControls.vue';
import SectionHeader from '@renderer/components/Library/SectionHeader.vue';
import ExaiSectionHeader from '@renderer/components/Library/Layout/ExaiSectionHeader.vue';
import FileSelector from '@renderer/components/Library/FileSelector.vue';
import EmptyState from '@renderer/components/Library/EmptyState.vue';
import ExaiImage from '@renderer/components/Library/ExaiImage.vue';
import Input from '@renderer/components/Library/Forms/Input.vue';
import FieldLabel from '@renderer/components/Library/Forms/FieldLabel.vue';
import ExaiButton from '@renderer/components/Library/ExaiButton.vue';
import ExaiGrid from '@renderer/components/Library/ExaiGrid.vue';
import ExaiList from '@renderer/components/Library/ExaiList/ExaiList.vue';
import ExaiListItem from '@renderer/components/Library/ExaiList/ExaiListItem.vue';
import ExaiCard from '@renderer/components/Library/ExaiCard.vue';
import ExaiIcon from '@renderer/components/Library/ExaiIcon.vue';
import ExaiTags from '@renderer/components/Library/ExaiTags.vue';

const registerGlobalComponents = (App) => {
    App.component('page-header', PageHeader);
    App.component('page-content', PageContent);
    App.component('page-controls', PageControls);
    App.component('section-header', SectionHeader);
    App.component('empty-state', EmptyState);
    App.component('exai-image', ExaiImage);
    App.component('form-input', Input);
    App.component('field-label', FieldLabel);
    App.component('file-selector', FileSelector);
    App.component('exai-button', ExaiButton);
    App.component('exai-grid', ExaiGrid);
    App.component('exai-list', ExaiList);
    App.component('exai-list-item', ExaiListItem);
    App.component('exai-section-header', ExaiSectionHeader);
    App.component('exai-card', ExaiCard);
    App.component('exai-icon', ExaiIcon);
    App.component('exai-tags', ExaiTags);
}

export default registerGlobalComponents;
