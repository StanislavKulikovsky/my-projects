import { createInput } from './common';
import avatarDefault from './images/avatar1.png';

export function createAvatar(
  parent: HTMLElement,
  player: {
    firstName: string;
    lastName: string;
    email: string;
    img64: string;
  },
): void {
  const avatarLabel = document.createElement('label');
  avatarLabel.htmlFor = 'modal-avatar';
  avatarLabel.className = 'modal-avatar-label';
  parent.appendChild(avatarLabel);

  const can = document.createElement('canvas');
  const con = can.getContext('2d');
  const avatar = new Image();

  const avatarInput = createInput(avatarLabel, 'file', 'modal-avatar-input', 'modal-avatar');

  avatar.onload = () => {
    if (con) {
      can.width = avatar.naturalWidth > avatar.naturalHeight ? avatar.naturalHeight : avatar.naturalWidth;
      can.height = avatar.naturalHeight > avatar.naturalWidth ? avatar.naturalWidth : avatar.naturalHeight;
      con.drawImage(
        avatar,
        avatar.naturalWidth > avatar.naturalHeight ? (avatar.naturalWidth - avatar.naturalHeight) / 2 : 0,
        avatar.naturalHeight > avatar.naturalWidth ? (avatar.naturalHeight - avatar.naturalWidth) / 2 : 0,
        avatar.naturalWidth > avatar.naturalHeight ? avatar.naturalHeight : avatar.naturalWidth,
        avatar.naturalHeight > avatar.naturalWidth ? avatar.naturalWidth : avatar.naturalHeight,
        0,
        0,
        avatar.naturalWidth > avatar.naturalHeight ? avatar.naturalHeight : avatar.naturalWidth,
        avatar.naturalHeight > avatar.naturalWidth ? avatar.naturalWidth : avatar.naturalHeight,
      );
      const tempImg = new Image();
      tempImg.src = can.toDataURL();
      tempImg.onload = () => {
        can.width = 198;
        can.height = 198;
        con.drawImage(tempImg, 0, 0, 198, 198);
      };
      player.img64 = can.toDataURL();
    }

    avatarInput.onchange = () => {
      if (avatarInput.files) {
        const file = avatarInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            if (typeof reader.result === 'string') {
              avatar.src = reader.result;
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };
  avatar.src = avatarDefault;
  avatarLabel.appendChild(can);
}
