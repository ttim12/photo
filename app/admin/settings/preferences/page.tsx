'use client'

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '~/lib/utils/fetcher'
import { toast } from 'sonner'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '~/components/ui/button'
import { Switch } from '~/components/ui/switch'
import { useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { CopyIcon } from '~/components/icons/copy'

export default function Preferences() {
  const [title, setTitle] = useState('')
  const [customFaviconUrl, setCustomFaviconUrl] = useState('')
  const [customAuthor, setCustomAuthor] = useState('')
  const [feedId, setFeedId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [customIndexStyle, setCustomIndexStyle] = useState('')
  const [previewImageMaxWidth, setPreviewImageMaxWidth] = useState('0')
  const [customIndexDownloadEnable, setCustomIndexDownloadEnable] = useState(false)
  const [enablePreviewImageMaxWidthLimit, setPreviewImageMaxWidthLimitEnabled] = useState(false)
  const [previewQualityInput, setPreviewQualityInput] = useState('0.2')
  const t = useTranslations()

  const { data, isValidating, isLoading } = useSWR<{ config_key: string, config_value: string }[]>('/api/v1/settings/get-custom-info', fetcher)

  async function updateInfo() {
    const maxWidth = parseInt(previewImageMaxWidth)
    if (isNaN(maxWidth) || maxWidth < 0) {
      toast.error('预览图最大宽度限制不能小于 0')
      return
    }
    const previewQuality = parseFloat(previewQualityInput)
    if (isNaN(previewQuality) || previewQuality <= 0 || previewQuality > 1) {
      toast.error('预览图压缩质量只支持0-1，大于0')
      return
    }
    try {
      setLoading(true)
      await fetch('/api/v1/settings/update-custom-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          customFaviconUrl: customFaviconUrl,
          customAuthor: customAuthor,
          feedId: feedId,
          userId: userId,
          customIndexStyle: customIndexStyle,
          customIndexDownloadEnable: customIndexDownloadEnable,
          enablePreviewImageMaxWidthLimit,
          previewImageMaxWidth: maxWidth,
          previewQuality,
        }),
      }).then(res => res.json())
      toast.success('修改成功！')
    } catch (e) {
      toast.error('修改失败！')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTitle(data?.find((item) => item.config_key === 'custom_title')?.config_value || '')
    setCustomFaviconUrl(data?.find((item) => item.config_key === 'custom_favicon_url')?.config_value || '')
    setCustomAuthor(data?.find((item) => item.config_key === 'custom_author')?.config_value || '')
    setFeedId(data?.find((item) => item.config_key === 'rss_feed_id')?.config_value || '')
    setUserId(data?.find((item) => item.config_key === 'rss_user_id')?.config_value || '')
    setCustomIndexStyle(data?.find((item) => item.config_key === 'custom_index_style')?.config_value || '0')
    setCustomIndexDownloadEnable(data?.find((item) => item.config_key === 'custom_index_download_enable')?.config_value.toString() === 'true' || false)
    setPreviewImageMaxWidth(data?.find((item) => item.config_key === 'preview_max_width_limit')?.config_value?.toString() || '0')
    setPreviewImageMaxWidthLimitEnabled(data?.find((item) => item.config_key === 'preview_max_width_limit_switch')?.config_value === '1')
    setPreviewQualityInput(data?.find((item) => item.config_key === 'preview_quality')?.config_value || '0.2')
  }, [data])

  return (
    <div className="flex flex-col space-y-4 h-full flex-1">
      <div className="flex justify-between space-x-1">
        <div>{t("Link.preferences")}</div>
        <Button
          variant="outline"
          disabled={loading || isValidating}
          onClick={() => updateInfo()}
          aria-label={t("Button.submit")}
          className="cursor-pointer"
        >
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>}
          {t("Button.submit")}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        <div className="rounded space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title">{t('Preferences.webSiteTitle')}</Label>
            <Input
              type="text"
              id="title"
              disabled={isValidating || isLoading}
              value={title || ''}
              placeholder={t('Preferences.inputWebSiteTitle')}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="customFaviconUrl"> favicon </Label>
            <Input
              type="text"
              id="customFaviconUrl"
              disabled={isValidating || isLoading}
              value={customFaviconUrl || ''}
              placeholder={t('Preferences.favicon')}
              onChange={(e) => setCustomFaviconUrl(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="customAuthor">{t('Preferences.webAuthor')}</Label>
            <Input
              type="text"
              id="customAuthor"
              disabled={isValidating || isLoading}
              value={customAuthor || ''}
              placeholder={t('Preferences.inputWebAuthor')}
              onChange={(e) => setCustomAuthor(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="feedId"> RSS feedId </Label>
            <Input
              type="text"
              id="feedId"
              disabled={isValidating || isLoading}
              value={feedId || ''}
              placeholder={t('Preferences.inputFeedId')}
              onChange={(e) => setFeedId(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="userId"> RSS userId </Label>
            <Input
              type="text"
              id="userId"
              disabled={isValidating || isLoading}
              value={userId || ''}
              placeholder={t('Preferences.inputUserId')}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="userId"> RSS URI </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="link"
                defaultValue={window.location.origin + '/rss.xml'}
                readOnly
              />
              <CopyIcon
                onClick={async () => {
                  try {
                    const url = window.location.origin + '/rss.xml'
                    // @ts-ignore
                    await navigator.clipboard.writeText(url);
                    toast.success('复制成功！', {duration: 500})
                  } catch (error) {
                    toast.error('复制失败！', {duration: 500})
                  }
                }}
                size={18}
              />
            </div>
          </div>
        </div>
        <div className="rounded space-y-4">
          <div className="w-full max-w-sm space-y-1">
            <Label htmlFor="indexStyleSelect"> {t('Preferences.indexStyleSelect')} </Label>
            <Select value={customIndexStyle} onValueChange={(value) => setCustomIndexStyle(value)}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder={t('Preferences.indexStyleSelect')} />
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                <SelectItem className="cursor-pointer" value="0">{t('Preferences.indexStyleDefault')}</SelectItem>
                <SelectItem className="cursor-pointer" value="1">{t('Preferences.indexStyleStar')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="previewQuality">{t('Preferences.previewQuality')}</Label>
            <Input
              type="text"
              id="previewQuality"
              disabled={isValidating || isLoading}
              value={previewQualityInput}
              placeholder={t('Preferences.inputPreviewQuality')}
              onChange={(e) => setPreviewQualityInput(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="maxWidth">{t('Preferences.maxWidth')}</Label>
            <Input
              type="number"
              id="maxWidth"
              disabled={isValidating || isLoading}
              value={previewImageMaxWidth}
              placeholder={t('Preferences.inputMaxWidth')}
              onChange={(e) => setPreviewImageMaxWidth(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded space-y-4">
          <label
            htmlFor="customIndexDownloadEnable"
            className="w-full max-w-sm cursor-pointer block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <span className="text-xs font-medium text-gray-700">{t('Preferences.customIndexDownloadEnable')}</span>
            <div>
              <Switch
                id="customIndexDownloadEnable"
                disabled={isValidating || isLoading}
                checked={customIndexDownloadEnable}
                className="cursor-pointer"
                onCheckedChange={checked => {
                  setCustomIndexDownloadEnable(checked)
                }}
              />
            </div>
          </label>
          <label
            htmlFor="enableMaxWidthLimit"
            className="w-full max-w-sm cursor-pointer block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <span className="text-xs font-medium text-gray-700">{t('Preferences.enableMaxWidthLimit')}</span>
            <div>
              <Switch
                id="enableMaxWidthLimit"
                disabled={isValidating || isLoading}
                checked={enablePreviewImageMaxWidthLimit}
                className="cursor-pointer"
                onCheckedChange={checked => {
                  setPreviewImageMaxWidthLimitEnabled(checked)
                }}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
