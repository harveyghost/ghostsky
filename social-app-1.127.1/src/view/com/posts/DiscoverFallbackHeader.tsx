import {View} from 'react-native'
import {Trans} from '@lingui/react/macro'

import {usePalette} from '#/lib/hooks/usePalette'
import {InfoCircleIcon} from '#/lib/icons'
import {useTheme} from '#/alf'
import {TextLink} from '../util/Link'
import {Text} from '../util/text/Text'

export function DiscoverFallbackHeader() {
  const pal = usePalette('default')
  const t = useTheme()
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderTopWidth: 1,
        },
        pal.border,
        t.atoms.bg_contrast_25,
      ]}>
      <View style={{width: 68, paddingLeft: 12}}>
        <InfoCircleIcon size={36} style={pal.textLight} strokeWidth={1.5} />
      </View>
      <View style={{flex: 1}}>
        <Text type="md" style={pal.text}>
          <Trans>
            We ran out of posts from your follows. Here's the latest from{' '}
            <TextLink
              type="md-medium"
              href="/profile/bsky.app/feed/whats-hot"
              text="Discover"
              style={pal.link}
            />
            .
          </Trans>
        </Text>
      </View>
    </View>
  )
}
