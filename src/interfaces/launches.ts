export interface Launch {
  launch_success: boolean;
  flight_number: number;
  mission_name: string;
  launch_year: string;
  details: string | null;
  links: {
    mission_patch_small: string | null;
    video_link: string | null;
  };
}
