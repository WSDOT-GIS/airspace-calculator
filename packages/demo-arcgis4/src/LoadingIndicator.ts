import { watch } from '@arcgis/core/core/reactiveUtils';
import type View from '@arcgis/core/views/View';

/**
 * Adds a loading indicator to a {@link View}.
 * @param view A map view
 */
export function setupLoadingIndicator(
  view: View,
  position: string | __esri.UIAddPosition = {
    index: 0,
    position: 'bottom-trailing',
  },
) {
  const progressBar = document.createElement('progress');
  view.ui.add(progressBar, position);

  // Show the progress bar if the map is updating,
  // hide it otherwise.
  watch(
    () => view.updating,
    (isUpdating, _wasUpdating) => {
      progressBar.hidden = !isUpdating;
    },
  );

  return progressBar;
}
