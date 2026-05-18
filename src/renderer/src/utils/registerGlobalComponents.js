import AppTitlebar from '@renderer/components/App/AppTitlebar.vue';
import AppNavBtns from '@renderer/components/App/AppNavBtns.vue';
import AppWindowControls from '@renderer/components/App/AppWindowControls.vue';
import AppOpenExplorer from '@renderer/components/App/AppOpenExplorer.vue';

import ExaiButton from '@renderer/components/Library/ExaiButton.vue';
import ExaiCard from '@renderer/components/Library/ExaiCard.vue';
import ExaiGrid from '@renderer/components/Library/ExaiGrid.vue';
import ExaiIcon from '@renderer/components/Library/ExaiIcon.vue';
import ExaiImage from '@renderer/components/Library/ExaiImage.vue';
import ExaiList from '@renderer/components/Library/ExaiList/ExaiList.vue';
import ExaiListItem from '@renderer/components/Library/ExaiList/ExaiListItem.vue';
import ExaiTags from '@renderer/components/Library/ExaiTags.vue';
import ExaiTooltip from '@renderer/components/Library/ExaiTooltip.vue';

import PageHeader from '@renderer/components/Library/Layout/PageHeader.vue';
import PageContent from '@renderer/components/Library/Layout/PageContent.vue';
import PageControls from '@renderer/components/Library/Layout/PageControls.vue';
import SectionHeader from '@renderer/components/Library/SectionHeader.vue';
import ExaiSectionHeader from '@renderer/components/Library/Layout/ExaiSectionHeader.vue';
import FileSelector from '@renderer/components/Library/FileSelector.vue';
import EmptyState from '@renderer/components/Library/EmptyState.vue';
import Input from '@renderer/components/Library/Forms/Input.vue';
import FieldLabel from '@renderer/components/Library/Forms/FieldLabel.vue';

import AudioPlayer from '@renderer/components/AudioPlayer/AudioPlayer.vue';
import AudioControls from '@renderer/components/AudioPlayer/AudioControls.vue';
import AudioControlsActions from '@renderer/components/AudioPlayer/AudioControlsActions.vue';
import AudioControlsPlayBtn from '@renderer/components/AudioPlayer/AudioControlsPlayBtn.vue';
import AudioControlsPrevBtn from '@renderer/components/AudioPlayer/AudioControlsPrevBtn.vue';
import AudioControlsNextBtn from '@renderer/components/AudioPlayer/AudioControlsNextBtn.vue';
import AudioControlsRandomBtn from '@renderer/components/AudioPlayer/AudioControlsRandomBtn.vue';
import AudioControlsRepeatBtn from '@renderer/components/AudioPlayer/AudioControlsRepeatBtn.vue';
import AudioControlsVolume from '@renderer/components/AudioPlayer/AudioControlsVolume.vue';
import AudioControlsProgressBar from '@renderer/components/AudioPlayer/AudioControlsProgressBar.vue';

const registerGlobalComponents = (App) => {
    App.component('page-header', PageHeader);
    App.component('page-content', PageContent);
    App.component('page-controls', PageControls);
    App.component('audio-controls', AudioControls);
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
    App.component('audio-player', AudioPlayer);
    App.component('audio-controls-play-btn', AudioControlsPlayBtn);
    App.component('audio-controls-prev-btn', AudioControlsPrevBtn);
    App.component('audio-controls-next-btn', AudioControlsNextBtn);
    App.component('audio-controls-random-btn', AudioControlsRandomBtn);
    App.component('audio-controls-repeat-btn', AudioControlsRepeatBtn);
    App.component('audio-controls-volume', AudioControlsVolume);
    App.component('audio-controls-actions', AudioControlsActions);
    App.component('audio-controls-progress-bar', AudioControlsProgressBar);
    App.component('app-titlebar', AppTitlebar);
    App.component('app-nav-btns', AppNavBtns);
    App.component('app-window-controls', AppWindowControls);
    App.component('exai-tooltip', ExaiTooltip);
    App.component('app-open-explorer', AppOpenExplorer);
}

export default registerGlobalComponents;
