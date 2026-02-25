import { setDonate } from '../actions/donateActions';
import { DonateService } from '../services/donate.service';
import { AppThunk } from '../store/store';

export const fetchDonates = (): AppThunk => async dispatch => {
  try {
    const res = await DonateService.get();
    // Add defensive check to prevent crash
    if (res && res.length >= 2) {
      dispatch(
        setDonate({
          donates: res[0],
          categories: res[1],
        }),
      );
    } else {
      console.error("Invalid response from DonateService.get():", res);
    }
  } catch (e) {
    console.error("Error fetching donates:", e);
  }
};
