import { removeSpaces } from "./remove-spaces";

export const concatHangjeongDongName = (hangjeongDong) => {
  return `${hangjeongDong?.region_2depth_name} ${hangjeongDong?.region_3depth_name} ${hangjeongDong?.region_4depth_name}`;
};

export const extractSiGunGuName = (hangjeongDong) => {
  return removeSpaces(`${hangjeongDong?.region_2depth_name}`);
};
