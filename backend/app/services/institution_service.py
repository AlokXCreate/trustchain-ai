import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from app.models.entities import Institution
from app.models.enums import InstitutionStatus, AuditEventType
from app.schemas.schemas import InstitutionApplyRequest, InstitutionApprovalRequest
from app.services.audit_service import audit_service


class InstitutionService:
    def __init__(self):
        self._institutions: List[Institution] = []
        self._seed_demo_institutions()

    def list_institutions(
        self,
        status: Optional[InstitutionStatus] = None,
        search: Optional[str] = None
    ) -> List[Institution]:
        results = self._institutions.copy()
        if status:
            results = [inst for inst in results if inst.status == status]
        if search:
            s = search.lower()
            results = [
                inst for inst in results
                if s in inst.name.lower() or s in inst.official_domain.lower() or s in inst.registration_number.lower()
            ]
        results.sort(key=lambda x: x.created_at, reverse=True)
        return results

    def get_by_id(self, institution_id: str) -> Optional[Institution]:
        for inst in self._institutions:
            if inst.id == institution_id:
                return inst
        return None

    def apply_as_issuer(self, data: InstitutionApplyRequest, user_id: str, user_name: str) -> Institution:
        institution = Institution(
            id=f"inst_{uuid.uuid4().hex[:8]}",
            name=data.name,
            official_domain=data.official_domain,
            organization_type=data.organization_type,
            registration_number=data.registration_number,
            website=data.website,
            address=data.address,
            contact_email=data.contact_email,
            status=InstitutionStatus.PENDING,  # Must be approved by administrator
            authorized_representatives=[user_id],
            credentials_issued_count=0,
            verification_count=0,
            created_at=datetime.utcnow()
        )
        self._institutions.append(institution)

        audit_service.log_event(
            user_id=user_id,
            user_name=user_name,
            event_type=AuditEventType.INSTITUTION_APPROVAL,
            resource_id=institution.id,
            resource_type="institution",
            event_details=f"Institutional accreditation application submitted for {institution.name} ({institution.official_domain})",
        )
        return institution

    def update_approval_status(
        self,
        institution_id: str,
        approval_data: InstitutionApprovalRequest,
        admin_id: str,
        admin_name: str
    ) -> Optional[Institution]:
        institution = self.get_by_id(institution_id)
        if not institution:
            return None

        institution.status = approval_data.status
        if approval_data.status == InstitutionStatus.APPROVED:
            institution.approval_date = datetime.utcnow()

        audit_service.log_event(
            user_id=admin_id,
            user_name=admin_name,
            event_type=AuditEventType.INSTITUTION_APPROVAL,
            resource_id=institution.id,
            resource_type="institution",
            event_details=f"Admin {admin_name} changed institution status of {institution.name} to {approval_data.status.value}",
        )
        return institution

    def _seed_demo_institutions(self):
        demo_insts = [
            Institution(
                id="inst_mit_01",
                name="Massachusetts Institute of Technology (MIT)",
                official_domain="mit.edu",
                organization_type="Higher Education University",
                registration_number="EDU-US-MIT-1861",
                website="https://mit.edu",
                address="77 Massachusetts Ave, Cambridge, MA 02139",
                contact_email="registrar@mit.edu",
                status=InstitutionStatus.APPROVED,
                approval_date=datetime.utcnow() - timedelta(days=120),
                authorized_representatives=["usr_inst_01"],
                credentials_issued_count=1420,
                verification_count=3890,
                created_at=datetime.utcnow() - timedelta(days=150)
            ),
            Institution(
                id="inst_stanford_02",
                name="Stanford University Registrar",
                official_domain="stanford.edu",
                organization_type="Higher Education University",
                registration_number="EDU-US-STAN-1885",
                website="https://stanford.edu",
                address="450 Jane Stanford Way, Stanford, CA 94305",
                contact_email="registrar@stanford.edu",
                status=InstitutionStatus.APPROVED,
                approval_date=datetime.utcnow() - timedelta(days=90),
                authorized_representatives=[],
                credentials_issued_count=2150,
                verification_count=5210,
                created_at=datetime.utcnow() - timedelta(days=110)
            ),
            Institution(
                id="inst_oxford_03",
                name="Oxford Digital Academy & Certification",
                official_domain="oxford-digital.org",
                organization_type="Professional Training Institute",
                registration_number="UK-CER-OX-2021",
                website="https://oxford-digital.org",
                address="Wellington Square, Oxford OX1 2JD, UK",
                contact_email="accreditation@oxford-digital.org",
                status=InstitutionStatus.UNDER_REVIEW,
                approval_date=None,
                authorized_representatives=[],
                credentials_issued_count=0,
                verification_count=12,
                created_at=datetime.utcnow() - timedelta(days=2)
            ),
            Institution(
                id="inst_unverified_04",
                name="Global Tech Skills Academy",
                official_domain="globaltechskills-fake.net",
                organization_type="Private Training Provider",
                registration_number="PVT-SKL-9921",
                website="http://globaltechskills-fake.net",
                address="10 Industrial Park, Road 4",
                contact_email="support@globaltechskills-fake.net",
                status=InstitutionStatus.REJECTED,
                approval_date=None,
                authorized_representatives=[],
                credentials_issued_count=0,
                verification_count=4,
                created_at=datetime.utcnow() - timedelta(days=20)
            ),
        ]
        self._institutions.extend(demo_insts)


institution_service = InstitutionService()
