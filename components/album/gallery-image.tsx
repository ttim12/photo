'use client'

import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import type { ImageType } from '~/types'
import * as React from 'react'
import { CameraIcon } from '~/components/icons/camera'
import { ApertureIcon } from '~/components/icons/aperture'
import { TimerIcon } from '~/components/icons/timer'
import { CrosshairIcon } from '~/components/icons/crosshair'
import { GaugeIcon } from '~/components/icons/gauge'
import { CopyIcon } from '~/components/icons/copy'
import { toast } from 'sonner'
import { LinkIcon } from '~/components/icons/link'
import { RefreshCWIcon } from '~/components/icons/refresh-cw'
import { cn } from '~/lib/utils'
import { DownloadIcon } from '~/components/icons/download'
import PreviewImageExif from '~/components/album/preview-image-exif'
import useSWR from 'swr'
import type { ImageDataProps } from '~/types/props'
import { ClockIcon } from '~/components/icons/clock'
import dayjs from 'dayjs'
import { Badge } from '~/components/ui/badge'
import { useRouter } from 'next-nprogress-bar'

export default function GalleryImage({ photo, configData }: { photo: ImageType, configData: any }) {
  const router = useRouter()

  const exifIconClass = 'dark:text-gray-50 text-gray-500'
  const exifTextClass = 'text-tiny text-sm select-none items-center dark:text-gray-50 text-gray-500'

  const { data: download = false, mutate: setDownload } = useSWR(['masonry/download', photo?.url ?? ''], null)

  const exifProps: ImageDataProps = {
    data: photo,
  }

  async function downloadImg() {
    setDownload(true)
    try {
      let msg = '开始下载，原图较大，请耐心等待！'
      if (photo.album_license != null) {
        msg += '图片版权归作者所有, 分享转载需遵循 ' + photo.album_license + ' 许可协议！'
      }

      toast.warning(msg, { duration: 1500 })
      await fetch(`/api/open/get-image-blob?imageUrl=${photo.url}`)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          const parsedUrl = new URL(photo.url);
          const filename = parsedUrl.pathname.split('/').pop();
          link.download = filename || "downloaded-file";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
    } catch (e) {
      toast.error('下载失败！', { duration: 500 })
    } finally {
      setDownload(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row w-full items-start justify-between sm:relative overflow-x-clip">
      <div className="flex flex-1 flex-col px-2 sm:sticky top-4 self-start">
        <div className="flex space-x-2 py-1 sm:justify-end">
          <div className="font-semibold">{photo.title}</div>
        </div>
        {photo?.exif?.data_time &&
          <div className="hidden sm:flex items-center space-x-1 sm:justify-end">
            <ClockIcon className={exifIconClass} size={18}/>
            <p className={exifTextClass}>
              {dayjs(photo?.exif?.data_time, 'YYYY:MM:DD HH:mm:ss').isValid() ?
                dayjs(photo?.exif?.data_time, 'YYYY:MM:DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                : photo?.exif.data_time
              }
            </p>
          </div>
        }
        <article className="hidden sm:flex text-wrap text-right dark:text-gray-50 text-gray-500">
          <p className="w-full">{photo?.detail}</p>
        </article>
      </div>
      <div
        className="show-up-motion relative inline-block select-none sm:w-[66.667%] mx-auto shadow-gray-200 dark:shadow-gray-800">
        <LazyLoadImage
          width={photo.width}
          height={photo.height}
          src={photo.url}
          alt={photo.title}
          effect="blur"
          wrapperProps={{
            style: {transitionDelay: "0.5s"},
          }}
        />
        {
          photo.type === 2 &&
          <div className="absolute top-2 left-2 p-5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-3 right-3 text-white opacity-75 z-10"
                 width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                 strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" fill="none"></path>
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="15.9" y1="20.11" x2="15.9" y2="20.12"></line>
              <line x1="19.04" y1="17.61" x2="19.04" y2="17.62"></line>
              <line x1="20.77" y1="14" x2="20.77" y2="14.01"></line>
              <line x1="20.77" y1="10" x2="20.77" y2="10.01"></line>
              <line x1="19.04" y1="6.39" x2="19.04" y2="6.4"></line>
              <line x1="15.9" y1="3.89" x2="15.9" y2="3.9"></line>
              <line x1="12" y1="3" x2="12" y2="3.01"></line>
              <line x1="8.1" y1="3.89" x2="8.1" y2="3.9"></line>
              <line x1="4.96" y1="6.39" x2="4.96" y2="6.4"></line>
              <line x1="3.23" y1="10" x2="3.23" y2="10.01"></line>
              <line x1="3.23" y1="14" x2="3.23" y2="14.01"></line>
              <line x1="4.96" y1="17.61" x2="4.96" y2="17.62"></line>
              <line x1="8.1" y1="20.11" x2="8.1" y2="20.12"></line>
              <line x1="12" y1="21" x2="12" y2="21.01"></line>
            </svg>
          </div>
        }
      </div>
      <div className="flex flex-col flex-1 sm:sticky px-2 py-1 sm:py-0 sm:space-y-1 top-4 self-start">
        <div className="flex flex-wrap space-x-2 sm:space-x-0 sm:flex-col flex-1 text-gray-500 sm:sticky">
          {photo?.exif?.make && photo?.exif?.model &&
            <div className="flex items-center space-x-1">
              <CameraIcon className={exifIconClass} size={18} />
              <p className={exifTextClass}>
                {`${photo?.exif?.make} ${photo?.exif?.model}`}
              </p>
            </div>
          }
          {photo?.exif?.f_number &&
            <div className="flex items-center space-x-1">
              <ApertureIcon className={exifIconClass} size={18} />
              <p className={exifTextClass}>
                {photo?.exif?.f_number}
              </p>
            </div>
          }
          {photo?.exif?.exposure_time &&
            <div className="flex items-center space-x-1">
              <TimerIcon className={exifIconClass} size={18} />
              <p className={exifTextClass}>
                {photo?.exif?.exposure_time}
              </p>
            </div>
          }
          {photo?.exif?.focal_length &&
            <div className="flex items-center space-x-1">
              <CrosshairIcon className={exifIconClass} size={18} />
              <p className={exifTextClass}>
                {photo?.exif?.focal_length}
              </p>
            </div>
          }
          {photo?.exif?.iso_speed_rating &&
            <div className="flex items-center space-x-1">
              <GaugeIcon className={exifIconClass} size={18} />
              <p className={exifTextClass}>
                {photo?.exif?.iso_speed_rating}
              </p>
            </div>
          }
        </div>
        {photo?.labels &&
          <div className="flex flex-wrap space-x-2 sm:sticky">
            {photo?.labels.map((tag: string) => (
              <Badge
                variant="secondary"
                className="cursor-pointer select-none"
                key={tag}
                onClick={() => {
                  router.push(`/tag/${tag}`)
                }}
              >{tag}</Badge>
            ))}
          </div>
        }
        <div className="flex flex-wrap space-x-1 sm:sticky">
          <CopyIcon
            className={exifIconClass}
            size={20}
            onClick={async () => {
              try {
                const url = photo?.url
                // @ts-ignore
                await navigator.clipboard.writeText(url);
                let msg = '复制图片链接成功！'
                if (photo?.album_license != null) {
                  msg = '图片版权归作者所有, 分享转载需遵循 ' + photo?.album_license + ' 许可协议！'
                }
                toast.success(msg, {duration: 1500})
              } catch (error) {
                toast.error('复制图片链接失败！', {duration: 500})
              }
            }}
          />
          <LinkIcon
            className={exifIconClass}
            size={20}
            onClick={async () => {
              try {
                const url = window.location.origin + '/preview/' + photo.id
                // @ts-ignore
                await navigator.clipboard.writeText(url);
                toast.success('复制分享直链成功！', {duration: 500})
              } catch (error) {
                toast.error('复制分享直链失败！', {duration: 500})
              }
            }}
          />
          {configData?.find((item: any) => item.config_key === 'custom_index_download_enable')?.config_value.toString() === 'true'
            && <>
              {download ?
                <RefreshCWIcon
                  className={cn(exifIconClass, 'animate-spin cursor-not-allowed')}
                  size={20}
                />:
                <DownloadIcon
                  className={exifIconClass}
                  size={20}
                  onClick={() => downloadImg()}
                />
              }
            </>
          }
          <PreviewImageExif {...exifProps} />
        </div>
      </div>
    </div>
  )
}