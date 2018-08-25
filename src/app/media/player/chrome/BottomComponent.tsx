import { h, Component } from "preact";
import { ChromeProgressBarComponent } from "./ProgressBarComponent";
import { IPlayerApi, IVideoDetail } from "../IPlayerApi";
import { VolumeSliderComponent } from "./VolumeSliderComponent";
import { PlayPauseButton } from "./PlayPauseButton";
import { NextVideoButton } from "./NextVideoButton";
import { VolumeMuteButton } from "./VolumeMuteButton";
import { TimeDisplay } from "./TimeDisplay";
import { SizeButton } from "./SizeButton";
import { FullscreenButton } from "./FullscreenButton";
import { SettingsButton } from './SettingsButton';

export interface IChromeBottomProps {
  api: IPlayerApi;
  onProgressHover: (time: number, percentage: number) => void;
  onProgressEndHover: () => void;
  onNextVideoHover: (detail: IVideoDetail) => void;
  onNextVideoEndHover: () => void;
  sizeButtonVisible?: boolean;
  onSizeButtonHover: () => void;
  onSizeButtonEndHover: () => void;
  onFullscreenButtonHover: () => void;
  onFullscreenButtonEndHover: () => void;
  onVolumeMuteButtonHover: () => void;
  onVolumeMuteButtonEndHover: () => void;
  onSettingsButtonHover: () => void;
  onSettingsButtonEndHover: () => void;
}

export class ChromeBottomComponent extends Component<IChromeBottomProps, {}> {
  private _progressBar?: ChromeProgressBarComponent;

  private _volumeSlider?: VolumeSliderComponent;
  
  private _volumeSliderFocus: boolean = false;
  private _volumeSliderMouse: boolean = false;

  private _onVolumeFocus() {
    this._volumeSliderFocus = true;

    this.base.classList.add('chrome-volume-slider-active');
  }

  private _onVolumeBlur() {
    this._volumeSliderFocus = false;

    if (!this._volumeSliderFocus && !this._volumeSliderMouse) {
      this.base.classList.remove('chrome-volume-slider-active');
    }
  }

  private _onVolumeMouseEnter() {
    if (this._volumeSliderMouse) return;
    this._volumeSliderMouse = true;

    this.base.classList.add('chrome-volume-slider-active');
  }
  
  private _onLeftMouseLeave() {
    if (!this._volumeSliderMouse) return;
    this._volumeSliderMouse = false;

    if (!this._volumeSliderFocus && !this._volumeSliderMouse) {
      this.base.classList.remove('chrome-volume-slider-active');
    }
  }

  setInternalVisibility(visiblity: boolean): void {
    if (this._progressBar) {
      this._progressBar.setInternalVisibility(visiblity);
    }
  }

  render(props: IChromeBottomProps): JSX.Element {
    const progressBarRef = (el?: ChromeProgressBarComponent) => this._progressBar = el;
    const volumeSliderRef = (el?: VolumeSliderComponent) => this._volumeSlider = el;
    
    const onVolumeFocus = () => this._onVolumeFocus();
    const onVolumeBlur = () => this._onVolumeBlur();

    const onLeftMouseLeave = () => this._onLeftMouseLeave();
    const onVolumeMouseEnter = () => this._onVolumeMouseEnter();
    
    return (
      <div class="html5-video-chrome-bottom">
        <ChromeProgressBarComponent
          ref={progressBarRef}
          api={props.api}
          onHover={props.onProgressHover}
          onEndHover={props.onProgressEndHover}></ChromeProgressBarComponent>
        <div class="chrome-controls">
          <div class="chrome-controls__left" onMouseLeave={onLeftMouseLeave}>
            <PlayPauseButton api={props.api}></PlayPauseButton>
            <NextVideoButton
              api={props.api}
              onHover={props.onNextVideoHover}
              onEndHover={props.onNextVideoEndHover}></NextVideoButton>
            <span onMouseEnter={onVolumeMouseEnter}>
              <VolumeMuteButton
                api={props.api}
                onHover={props.onVolumeMuteButtonHover}
                onEndHover={props.onVolumeMuteButtonEndHover}>
              </VolumeMuteButton>
              <VolumeSliderComponent
                ref={volumeSliderRef}
                onFocus={onVolumeFocus}
                onBlur={onVolumeBlur}
                api={props.api}>
              </VolumeSliderComponent>
            </span>
            <TimeDisplay api={props.api}></TimeDisplay>
          </div>
          <div class="chrome-controls__right">
            <SettingsButton
              api={props.api}
              onHover={props.onSettingsButtonHover}
              onEndHover={props.onSettingsButtonEndHover}></SettingsButton>
            <SizeButton
              api={props.api}
              visible={props.sizeButtonVisible}
              onHover={props.onSizeButtonHover}
              onEndHover={props.onSizeButtonEndHover}></SizeButton>
            <FullscreenButton
              api={props.api}
              onHover={props.onFullscreenButtonHover}
              onEndHover={props.onFullscreenButtonEndHover}></FullscreenButton>
          </div>
        </div>
      </div>
    );
  }
}