import Svg, {Path, type PathProps, type SvgProps} from 'react-native-svg'

import {usePalette} from '#/lib/hooks/usePalette'

const ratio = 54 / 61

export function Logomark({
  fill,
  ...rest
}: {fill?: PathProps['fill']} & SvgProps) {
  const pal = usePalette('default')
  // @ts-ignore it's fiiiiine
  const size = parseInt(rest.width || 32)

  return (
    <Svg
      fill="none"
      viewBox="0 0 61 54"
      {...rest}
      width={size}
      height={Number(size) * ratio}>
      <Path
        fill={fill || pal.text.color}
        fillRule="evenodd"
        clipRule="evenodd"
        // GHOST: replaced duplicate butterfly path with a ghost silhouette
        d="M7,27 A23.5,23.5 0 0,1 54,27 L54,47 A5.875,5.875 0 0,1 42.25,47 A5.875,5.875 0 0,1 30.5,47 A5.875,5.875 0 0,1 18.75,47 A5.875,5.875 0 0,1 7,47 Z M22,24 m-3.8,0 a3.8,3.8 0 1,0 7.6,0 a3.8,3.8 0 1,0 -7.6,0 Z M39,24 m-3.8,0 a3.8,3.8 0 1,0 7.6,0 a3.8,3.8 0 1,0 -7.6,0 Z"
      />
    </Svg>
  )
}
