import logoUrl from '../assets/logo.png'

type Props = {
  size?: number
  className?: string
}

export default function BrandLogo({ size = 40, className = '' }: Props): JSX.Element {
  return (
    <img
      className={`brand-logo ${className}`.trim()}
      src={logoUrl}
      alt=""
      width={size}
      height={size}
      draggable={false}
    />
  )
}
